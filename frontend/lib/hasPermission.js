function hasPermission(user, permissionsNeeded) {
  return user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  );
}

export default hasPermission;
