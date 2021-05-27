import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// at its simplest, access control is a yes or no value depending on the user's session

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

// generate permissions functions for each permission in the permissionsList
const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// permissions check if a user meets a specific criteria - yes or no
export const permissions = {
  ...generatedPermissions,
  // can also add custom permissions functions
  isMatt({ session }: ListAccessArgs) {
    return session?.data.name.includes('matt');
  },
};

// rule based functions - logical functions for list access, return a boolean/set of filters which limits which products the user can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true; // they can read everything
    }
    // otherwise they should only see available products (based on the status field)
    return { status: 'AVAILABLE' };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageCart
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. If not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageCart
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. If not, do they own this item?
    return { order: { user: { id: session.itemId } } };
  },
};
