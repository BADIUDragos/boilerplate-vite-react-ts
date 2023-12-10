import { describe, it, expect } from 'vitest';
import isAuthorized from '../isAuthorized'; // Adjust the import path as necessary
import { createUserInfoState } from '../../../__testUtils__/sliceSetups/auth';

describe('isAuthorized', () => {

  it('should return false if userInfo is null', () => {
    const result = isAuthorized(null, [], false, false);
    expect(result).toBe(false);
  });

  it('should return true if the user is a superuser', () => {
    const userInfo = createUserInfoState({permissions: ['view_content'], isSuperuser: true})

    const result = isAuthorized(userInfo, [], false, false);
    expect(result).toBe(true);
  });

  it('should return true for staff with the required permissions', () => {
    const userInfo = createUserInfoState({permissions: ['view_content'], isStaff: true})

    const result = isAuthorized(userInfo, ['view_content'], false, true);
    expect(result).toBe(true);
  });

  it('should return false for staff without the required permissions', () => {
    const userInfo = createUserInfoState({permissions: ['wrong_permission'], isStaff: true})

    const result = isAuthorized(userInfo, ['view_content'], false, true);
    expect(result).toBe(false);
  });

  it('should return false for normal user without the required permissions', () => {
    const userInfo = createUserInfoState({permissions: ['wrong_permission']})

    const result = isAuthorized(userInfo, ['view_content'], false, false);
    expect(result).toBe(false);
  });

  it('should return true for normal user with the required permissions', () => {
    const userInfo = createUserInfoState()
    
    const result = isAuthorized(userInfo, ['view_content'], false, false);
    expect(result).toBe(true);
  });

});