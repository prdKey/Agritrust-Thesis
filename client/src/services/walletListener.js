// walletListener.js
export const listenWalletDisconnect = (onDisconnect) => {
  if (!window.ethereum) return;

  window.ethereum.on("disconnect", () => {
    onDisconnect();
  });

  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      onDisconnect(); // wallet locked or disconnected
    }
  });
};
