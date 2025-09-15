import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, Check, Shield, Zap } from "lucide-react"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <CardTitle className="text-foreground">Wallet Connection</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Connect your wallet to receive encrypted payments securely
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button 
                              onClick={openConnectModal}
                              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
                            >
                              <Wallet className="w-4 h-4 mr-2" />
                              Connect Wallet
                            </Button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <Button 
                              onClick={openChainModal}
                              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
                            >
                              Wrong network
                            </Button>
                          );
                        }

                        return (
                          <div className="flex gap-2">
                            <Button
                              onClick={openChainModal}
                              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    marginRight: 4,
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? 'Chain icon'}
                                      src={chain.iconUrl}
                                      style={{ width: 12, height: 12 }}
                                    />
                                  )}
                                </div>
                              )}
                              {chain.name}
                            </Button>

                            <Button
                              onClick={openAccountModal}
                              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
                            >
                              {account.displayName}
                              {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
              <p className="text-xs text-muted-foreground text-center">
                Supports MetaMask, WalletConnect, and other Web3 wallets
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-sm text-foreground">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-sm text-foreground">Instant Payments</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Wallet Connected</span>
              </div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                Active
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Wallet Address</label>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <code className="flex-1 text-sm text-muted-foreground font-mono">
                  {address}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-success" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
            
            {balance && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Balance</label>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-foreground font-mono">
                    {balance.formatted} {balance.symbol}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}