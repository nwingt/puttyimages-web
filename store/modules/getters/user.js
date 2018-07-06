export const getUserLocalWallet = (state) => state.wallet;

export const getUserInfo = (state) => state.user;

export const getIsUserRegisterNeeded = (state) => state.isRegisterNeeded;

export const getIsUserAuthNeeded = (state) => state.isAuthNeeded;

export const isAuthenticated = (state) => state.isAuthenticated;

export const isAuthenticating = (state) => state.isAuthenticating;

export const isUnderAuth = (state) =>
  state.isAuthenticated && !state.isAuthenticating;
