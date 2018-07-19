import React from 'react';
import styles from './Login.module.scss';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Modal } from 'components';
import WalletRequired from './components/WalletRequired';
import UnlockWallet from './components/UnlockWallet';
import SignIn from './components/SignIn';
import SigningIn from './components/SigningIn';
import AddressMismatch from './components/AddressMismatch';
import { rootLoginSelector } from './selectors';
import { actions } from './reducer';
import { actions as authActions } from 'public-modules/Authentication';
import {
  getCurrentUserSelector,
  loginStateSelector,
  logoutStateSelector
} from 'public-modules/Authentication/selectors';
import {
  addressSelector,
  walletLockedSelector,
  hasWalletSelector
} from 'public-modules/Client/selectors';

const LoginComponent = props => {
  const {
    visible,
    stage,
    hasWallet,
    walletLocked,
    walletAddress,
    userAddress,
    img,
    showLogin,
    login,
    logout,
    signingIn,
    loggingOut
  } = props;

  if (!hasWallet) {
    return (
      <WalletRequired visible={visible} onClose={() => showLogin(false)} />
    );
  }

  if (walletLocked) {
    return <UnlockWallet visible={visible} onClose={() => showLogin(false)} />;
  }

  if (userAddress && userAddress !== walletAddress) {
    return (
      <AddressMismatch
        visible={visible}
        currentAddress={walletAddress}
        previousAddress={userAddress}
        img={img}
        logout={logout}
        loggingOut={loggingOut}
        onClose={() => showLogin(false)}
      />
    );
  }

  if (signingIn) {
    return <SigningIn visible={visible} />;
  }

  return (
    <SignIn visible={visible} onClose={() => showLogin(false)} signIn={login} />
  );
};

const mapStateToProps = state => {
  const rootLogin = rootLoginSelector(state);
  const user = getCurrentUserSelector(state);
  const loginState = loginStateSelector(state);
  const logoutState = logoutStateSelector(state);

  return {
    hasWallet: hasWalletSelector(state),
    walletLocked: walletLockedSelector(state),
    walletAddress: addressSelector(state),
    userAddress: user && user.public_address,
    visible: rootLogin.visible,
    stage: rootLogin.stage,
    img: user && user.img,
    signingIn: loginState.loading,
    loggingOut: logoutState.loading
  };
};

const Login = compose(
  connect(
    mapStateToProps,
    {
      showLogin: actions.showLogin,
      login: authActions.login,
      logout: authActions.logout
    }
  )
)(LoginComponent);

export default Login;
