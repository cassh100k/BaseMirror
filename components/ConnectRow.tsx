"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
export default function ConnectRow() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, status } = useConnect();
  const { disconnect } = useDisconnect();
  if (isConnected) {
    return (<div className="mt-6 text-xs text-white/70 flex items-center justify-center gap-3">
      <span>Connected: {address?.slice(0,6)}…{address?.slice(-4)}</span>
      <button onClick={() => disconnect()}>Disconnect</button></div>);
  }
  const injected = connectors.find(c => c.id === "injected") || connectors[0];
  return (<div className="mt-6 flex justify-center"><button onClick={() => connect({ connector: injected })}>{status === "pending" ? "Connecting…" : "Connect Wallet"}</button></div>);
}