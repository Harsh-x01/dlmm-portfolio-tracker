import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { formatAddress } from '../utils/formatting';

export function WalletButton() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex items-center gap-4">
      {connected && publicKey && (
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">
            {formatAddress(publicKey.toString())}
          </span>
        </div>
      )}
      <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !px-6 !py-2 !text-sm !font-medium transition-colors" />
    </div>
  );
}
