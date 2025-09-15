# Vercel Deployment Guide for Private Pay Forge

## Step-by-Step Manual Deployment Instructions

### Prerequisites
- GitHub account with access to the repository
- Vercel account (free tier available)
- Node.js 18+ installed locally (for testing)

### Step 1: Prepare the Repository
1. Ensure all code is committed and pushed to GitHub
2. Verify the build works locally:
   ```bash
   npm install
   npm run build
   ```

### Step 2: Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select **"NeoChain4Dev/private-pay-forge"** from the list
5. Click **"Import"**

### Step 3: Configure Project Settings
1. **Project Name**: `private-pay-forge` (or your preferred name)
2. **Framework Preset**: Select **"Vite"**
3. **Root Directory**: Leave as `./` (default)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Step 4: Environment Variables Configuration
Click **"Environment Variables"** and add the following:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

**Important**: Make sure to add these for all environments (Production, Preview, Development).

### Step 5: Advanced Configuration
1. Click **"Advanced"** tab
2. **Node.js Version**: Select `18.x` or `20.x`
3. **Functions**: Leave default settings
4. **Headers**: No additional headers needed
5. **Redirects**: No redirects needed
6. **Rewrites**: No rewrites needed

### Step 6: Deploy
1. Click **"Deploy"** button
2. Wait for the deployment to complete (usually 2-3 minutes)
3. You'll see a success message with your live URL

### Step 7: Verify Deployment
1. Click on the provided URL to visit your live site
2. Test wallet connection functionality
3. Verify all pages load correctly
4. Check that the build artifacts are properly served

### Step 8: Custom Domain (Optional)
1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate to be issued

### Step 9: Automatic Deployments
- **Production**: Automatically deploys from `main` branch
- **Preview**: Automatically deploys from pull requests
- **Development**: Automatically deploys from other branches

### Troubleshooting

#### Build Failures
- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly
- Check build logs in Vercel dashboard

#### Runtime Errors
- Verify environment variables are accessible
- Check browser console for errors
- Ensure wallet connection is working

#### Performance Issues
- Enable Vercel Analytics for monitoring
- Consider implementing code splitting
- Optimize bundle size if needed

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CHAIN_ID` | Ethereum Sepolia chain ID | Yes |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint for blockchain | Yes |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `NEXT_PUBLIC_INFURA_API_KEY` | Infura API key | Yes |

### Post-Deployment Checklist
- [ ] Site loads without errors
- [ ] Wallet connection works
- [ ] All pages are accessible
- [ ] Environment variables are set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is active
- [ ] Analytics is enabled (optional)

### Support
- Vercel Documentation: https://vercel.com/docs
- Project Repository: https://github.com/NeoChain4Dev/private-pay-forge
- Issues: Create GitHub issues for bugs or feature requests

### Cost Information
- **Vercel Free Tier**: 100GB bandwidth, 100GB-hours serverless function execution
- **Upgrade**: Available if you need more resources
- **Custom Domain**: Free on all tiers
