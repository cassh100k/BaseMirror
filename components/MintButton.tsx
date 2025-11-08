"use client";
import { useAccount, useWriteContract } from "wagmi";
import { encodeBase64 } from "./base64";
const ABI_SAFE_MINT = [{ "type":"function","name":"safeMint", "inputs":[{"name":"to","type":"address"},{"name":"uri","type":"string"}], "outputs":[], "stateMutability":"nonpayable" }];
const ABI_MINT_URI = [{ "type":"function","name":"mint", "inputs":[{"name":"uri","type":"string"}], "outputs":[], "stateMutability":"nonpayable" }];
function buildTokenURI(quote: string){ const meta = { name: `BaseMirror • ${quote.slice(0,32)}${quote.length>32?"…":""}`, description: quote, image: `data:text/plain;base64,${encodeBase64(quote)}` }; const jsonStr = JSON.stringify(meta); return `data:application/json;base64,${encodeBase64(jsonStr)}`; }
export default function MintButton({ quote }: { quote: string }) {
  const { isConnected, address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const contract = process.env.NEXT_PUBLIC_MIRROR_NFT_ADDRESS as `0x${string}` | undefined;
  const disabled = !isConnected || !contract || !quote;
  const onMint = async () => {
    if (disabled) return;
    const uri = buildTokenURI(quote);
    try {
      await writeContractAsync({ abi: ABI_SAFE_MINT as any, address: contract!, functionName: "safeMint", args: [address!, uri] });
      alert("Mint tx submitted via safeMint!");
    } catch {
      try {
        await writeContractAsync({ abi: ABI_MINT_URI as any, address: contract!, functionName: "mint", args: [uri] });
        alert("Mint tx submitted via mint(uri)!");
      } catch (e:any) {
        alert(`Mint failed: ${e?.message || e}`);
      }
    }
  };
  return (<button onClick={onMint} disabled={disabled} title={disabled ? "Connect wallet and set NEXT_PUBLIC_MIRROR_NFT_ADDRESS" : "Mint reflection on Base"}>🪙 Mint</button>);
}