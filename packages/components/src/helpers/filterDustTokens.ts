export const filterDustTokens = (tokens: any[], dustThreshold = 1) => {
  return tokens.filter(token => {
    const suspiciousPatterns = [
      /visit|claim|airdrop|reward|bonus/i,
      /t\.ly|t\.me/i,
      /www\./i,
      /\$trump|\$uѕdс/i
    ];
    
    const hasValidValue = token.balanceUSD > dustThreshold;
    const hasValidName = !suspiciousPatterns.some(pattern => 
      pattern.test(token.symbol) || pattern.test(token.name)
    );
    
    return hasValidValue && hasValidName;
  });
};