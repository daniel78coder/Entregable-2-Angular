import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify(); // Verificar que no hay peticiones pendientes
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should make a POST request to login endpoint', () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: 1, username: 'testuser', name: 'Test User' }
      };

      service.login('testuser', 'password').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('https://689e5ef83fed484cf876fdc8.mockapi.io/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'testuser', password: 'password' });

      req.flush(mockResponse);
    });

    it('should store token and user in localStorage on successful login', () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: 1, username: 'testuser', name: 'Test User' }
      };

      service.login('testuser', 'password').subscribe(() => {
        expect(localStorage.getItem('auth_token')).toBe('fake-jwt-token');
        expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(mockResponse.user);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const errorMessage = 'Invalid credentials';

      service.login('wrong', 'credentials').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(service['apiUrl']);
      req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should remove auth data from localStorage and navigate to login', () => {
      // Set up initial state
      localStorage.setItem('auth_token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Test User' }));

      spyOn(router, 'navigate');

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'fake-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when token does not exist', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when exists', () => {
      const mockUser = { id: 1, name: 'Test User' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      expect(service.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null when user does not exist', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return null for malformed user data', () => {
      localStorage.setItem('user', 'invalid-json');
      expect(service.getCurrentUser()).toBeNull();
    });
  });
});
