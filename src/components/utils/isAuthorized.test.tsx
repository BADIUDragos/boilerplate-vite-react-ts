import { describe, it, expect } from 'vitest';
import isAuthorized from './isAuthorized';
import { createUserInfoState } from '../../__testUtils__/sliceSetups/auth';

describe('isAuthorized', () => {

  it('should return false if userInfo is null', () => {
    const result = isAuthorized(null, [], false);
    expect(result).toBe(false);
  });

  it('should return true if the user is a superuser', () => {
    const userInfo = createUserInfoState({permissions: ['view_content'], isSuperuser: true})

    const result = isAuthorized(userInfo, [], false);
    expect(result).toBe(true);
  });

  it('should return true for staff when just requiredStaff', () => {
    const userInfo = createUserInfoState({ isStaff: true})

    const result = isAuthorized(userInfo, [], true);
    expect(result).toBe(true);
  });

  it('should return true for staff with the required permissions', () => {
    const userInfo = createUserInfoState({permissions: ['view_content'], isStaff: true})

    const result = isAuthorized(userInfo, ['view_content'], true);
    expect(result).toBe(true);
  });

  it('should return false for staff without the required permissions', () => {
    const userInfo = createUserInfoState({permissions: ['wrong_permission'], isStaff: true})

    const result = isAuthorized(userInfo, ['view_content'], true);
    expect(result).toBe(false);
  });

  it('should return false for normal user without the required permissions', () => {
    const userInfo = createUserInfoState({permissions: ['wrong_permission']})

    const result = isAuthorized(userInfo, ['view_content'], false);
    expect(result).toBe(false);
  });

  it('should return true for normal user with the required permissions', () => {
    const listOfPermissions = ['view_content', 'change_content', 'delete_content']
    const userInfo = createUserInfoState({permissions: listOfPermissions})
    
    const result = isAuthorized(userInfo, listOfPermissions, false);
    expect(result).toBe(true);
  });

  it('should return false for normal user with partial required permissions', () => {
    const userInfo = createUserInfoState({permissions: ['view_content', 'change_content']})
    
    const result = isAuthorized(userInfo, ['view_content', 'change_content', 'delete_content'], false);
    expect(result).toBe(true);
  });

});