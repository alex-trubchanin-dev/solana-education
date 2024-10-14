use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::{AssociatedToken, Create};

declare_id!("3Hj4o7AJE9MMKhukJma1dkDBmRs26Hzi8FZ7RfAoyYSm");

#[program]
mod manager {
    use super::*;

    const TOKEN_BURN_AMOUNT: u64 = 10;

    pub fn burn_tokens(ctx: Context<BurnTokens>) -> Result<()> {
        // Burn tokens
        let cpi_accounts = Burn {
            mint: ctx.accounts.token_mint.to_account_info(),
            from: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::burn(cpi_ctx, TOKEN_BURN_AMOUNT)?;

        Ok(())
    }

    pub fn burn_nft_for_tokens(ctx: Context<BurnNftForTokens>) -> Result<()> {
        let cpi_accounts = Burn {
            mint: ctx.accounts.nft_mint.to_account_info(),
            from: ctx.accounts.nft_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::burn(cpi_ctx, 1)?;

        // Возврат 10 токенов после успешного сжигания NFT
        let cpi_accounts = Transfer {
            from: ctx.accounts.token_pool.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.pool_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, TOKEN_BURN_AMOUNT)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnNftForTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub nft_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub token_pool: Account<'info, TokenAccount>,
    pub pool_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}
