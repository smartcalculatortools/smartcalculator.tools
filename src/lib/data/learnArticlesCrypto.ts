import type { LearnArticle } from "./learnArticlesShared";

export const cryptoLearnArticles: LearnArticle[] = [
  {
    categoryId: "crypto",
    slug: "choose-dca-or-single-entry",
    targetQuery: "dca vs lump sum crypto calculator",
    title: "How to Compare Crypto DCA Against a Single Entry Without Cherry-Picking",
    summary:
      "Use crypto DCA, profit and loss, fee impact, and risk reward calculators to compare staged entries against a one-time position.",
    intro:
      "Crypto traders often compare dollar-cost averaging and single-entry buying with hindsight instead of a repeatable process. The better comparison checks entry timing, fee drag, position exposure, and how much uncertainty you are trying to reduce. This guide shows how to use the crypto tools on the site to compare the two approaches with consistent assumptions.",
    calculatorSlugs: ["crypto-dca", "crypto-profit-loss", "crypto-fee-impact", "crypto-risk-reward"],
    sections: [
      {
        title: "Define whether the plan is investing or trading",
        body:
          "DCA and single-entry logic solve different problems depending on the time horizon. A long accumulation plan is not judged the same way as a short tactical trade.",
        bullets: [
          "Use Crypto DCA when capital is being deployed in repeated buys over time.",
          "Use Profit and Loss when the comparison is a more direct entry-versus-exit trade outcome.",
          "Keep the timeframe explicit so a long-term plan is not evaluated with short-term trade expectations.",
        ],
      },
      {
        title: "Include fee drag before comparing outcomes",
        body:
          "DCA can reduce timing stress, but multiple transactions may increase friction. Comparing the two approaches without fees usually overstates the cleaner-looking result.",
        bullets: [
          "Use Crypto Fee Impact to measure how repeated entries change breakeven.",
          "Compare net outcomes after fees instead of only the price path.",
          "Run both low-fee and higher-fee scenarios if the exchange or route may vary.",
        ],
      },
      {
        title: "Use risk reward only when the strategy has defined exits",
        body:
          "Risk reward is useful when the plan includes a clear stop and target. It becomes weaker when the approach is open-ended accumulation without a defined exit structure.",
        bullets: [
          "Use Crypto Risk Reward for setup-style entries with planned downside and upside.",
          "Keep DCA logic focused on allocation pacing rather than forced stop-target math.",
          "Avoid comparing two strategies with different exit rules as if they were identical.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is DCA always safer than a single entry?",
        answer:
          "It can reduce timing risk, but it may also add fees and prolong exposure. The better choice depends on timeframe, conviction, and execution costs.",
      },
      {
        question: "Why should I compare DCA and lump sum after fees?",
        answer:
          "Because repeated buys can create meaningful friction. A cleaner entry path on price alone may look different once transaction costs are included.",
      },
    ],
  },
  {
    categoryId: "crypto",
    slug: "size-a-crypto-trade-before-entry",
    targetQuery: "how to size a crypto trade",
    title: "How to Size a Crypto Trade Before You Enter and Regret the Risk",
    summary:
      "Use crypto position size, risk reward, profit and loss, and fee impact calculators to turn a trade idea into a controlled position.",
    intro:
      "Trade sizing is where many crypto mistakes become expensive. The setup may be valid, but the position can still be too large for the stop distance, too exposed to fees, or too optimistic about the target. This guide shows how to use the trading calculators on the site to define size before entry rather than improvising after the order is live.",
    calculatorSlugs: ["crypto-position-size", "crypto-risk-reward", "crypto-profit-loss", "crypto-fee-impact"],
    sections: [
      {
        title: "Start with account risk, not coin conviction",
        body:
          "Good sizing begins with how much of the account can be lost if the trade fails. Conviction in the idea does not replace a position-size rule.",
        bullets: [
          "Use Crypto Position Size to tie the trade to a fixed risk amount.",
          "Set the stop location before the size so the math reflects the actual setup.",
          "Reduce size if volatility forces a wider stop than usual.",
        ],
      },
      {
        title: "Check whether the reward justifies the exposure",
        body:
          "A trade can be correctly sized and still be weak if the expected upside does not clearly compensate for the downside and friction. Risk reward helps screen that structure.",
        bullets: [
          "Use Crypto Risk Reward after stop and target are already defined.",
          "Reject trades that need unrealistic price movement to justify the risk.",
          "Compare several target levels instead of assuming the furthest target is the plan.",
        ],
      },
      {
        title: "Add fees and realistic exit math",
        body:
          "Net result matters more than the clean chart idea. Fees and exit assumptions can change a decent trade into a marginal one, especially on shorter timeframes.",
        bullets: [
          "Use Crypto Fee Impact to estimate how much friction the trade must overcome.",
          "Use Profit and Loss to convert entry, exit, and size into actual account effect.",
          "Recalculate if scale-in or scale-out execution changes the number of fills.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should determine crypto position size first?",
        answer:
          "Start with the amount of account risk you are willing to lose if the stop is hit, then calculate size from the stop distance rather than from excitement about the setup.",
      },
      {
        question: "Why does a good chart setup still produce a bad trade?",
        answer:
          "Because trade quality also depends on size, stop distance, target realism, and fees. A good idea can become a poor position if those factors are ignored.",
      },
    ],
  },
  {
    categoryId: "crypto",
    slug: "compare-staking-yield-and-trading-return",
    targetQuery: "staking yield vs trading profit crypto",
    title: "How to Compare Staking Yield Against Trading Return in Crypto",
    summary:
      "Use crypto staking yield, profit and loss, DCA, and fee impact calculators to compare passive yield with active trade outcomes on the same capital.",
    intro:
      "Crypto users often compare staking and trading with completely different assumptions, which makes the conclusion weak from the start. The useful comparison asks what the same pool of capital might earn passively, what trading would require to beat it, and how fees or timing risk affect both choices. This guide helps frame that decision with the crypto tools on the site.",
    calculatorSlugs: ["crypto-staking-yield", "crypto-profit-loss", "crypto-dca", "crypto-fee-impact"],
    sections: [
      {
        title: "Treat staking yield as a baseline return",
        body:
          "Staking provides a reference point because it shows what capital might earn without repeated entry and exit decisions. That makes it a useful hurdle rate for active alternatives.",
        bullets: [
          "Use Crypto Staking Yield to estimate passive return on held assets.",
          "Compare the staking baseline over the same period as the trade idea.",
          "Keep token and lockup assumptions realistic before using the yield as a benchmark.",
        ],
      },
      {
        title: "Ask what trading must earn after friction",
        body:
          "Active trading should be judged by net return, not gross price movement. Fees and multiple executions can quickly reduce how much it really beats passive yield.",
        bullets: [
          "Use Profit and Loss to measure what a trading outcome actually returns on capital.",
          "Use Crypto Fee Impact so repeated trading friction is visible in the comparison.",
          "Require a meaningful margin over staking before calling active trading worth the effort.",
        ],
      },
      {
        title: "Use DCA when capital deployment is gradual",
        body:
          "If the position is being built over time, the baseline itself may change depending on when capital becomes active. That is where DCA planning becomes relevant.",
        bullets: [
          "Use Crypto DCA when the capital is not entering the market all at once.",
          "Compare the passive and active approach under the same funding schedule.",
          "Do not compare a fully deployed staking plan against a partially funded trading plan without adjusting the timeline.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why compare trading to staking at all?",
        answer:
          "Because staking provides a passive alternative for the same capital. Active trading should earn enough after fees and effort to justify taking the more demanding route.",
      },
      {
        question: "Can staking still be the better choice if trading wins sometimes?",
        answer:
          "Yes. If trading results are inconsistent or fee-heavy, a steadier passive yield can still be the stronger overall use of the capital.",
      },
    ],
  },
  {
    categoryId: "crypto",
    slug: "crypto-dca-vs-staking-for-long-term-holders",
    targetQuery: "crypto dca vs staking calculator",
    title: "Crypto DCA vs Staking: Which Strategy Fits a Long-Term Holder Better?",
    summary:
      "Use crypto DCA, staking yield, fee impact, and profit/loss calculators to compare gradual accumulation against passive yield on held capital.",
    intro:
      "Long-term crypto holders often compare DCA and staking as if they solve the same problem, but they do not. DCA changes how capital enters the market, while staking changes how already-held assets may earn yield over time. This guide shows how to compare them without mixing entry timing, fee drag, and passive return assumptions into one vague strategy.",
    calculatorSlugs: ["crypto-dca", "crypto-staking-yield", "crypto-fee-impact", "crypto-profit-loss"],
    sections: [
      {
        title: "Use DCA when the main problem is entry timing",
        body:
          "DCA is strongest when the capital is not yet fully deployed and the main concern is reducing the pressure of choosing one perfect entry point. It smooths the path into the position, but it does not create yield by itself.",
        bullets: [
          "Use Crypto DCA when buys are spread across several entries over time.",
          "Compare average cost basis rather than judging the strategy from one lucky or unlucky purchase.",
          "Keep the funding schedule consistent when you compare DCA to other options.",
        ],
      },
      {
        title: "Use staking when the capital is already held",
        body:
          "Staking is more relevant once the asset is already owned and the question becomes how that capital might earn a passive return. It answers a different stage of the decision than DCA.",
        bullets: [
          "Use Crypto Staking Yield to estimate passive return on assets that are already in the position.",
          "Check lockup terms and yield assumptions before treating staking as stable income.",
          "Do not compare staking to DCA unless the timing of capital deployment is made explicit.",
        ],
      },
      {
        title: "Compare net effect after fees and opportunity cost",
        body:
          "A fair comparison should include fees, deployment timing, and what each strategy is giving up. DCA may reduce timing stress while staking may produce yield, but both have tradeoffs that can be measured.",
        bullets: [
          "Use Crypto Fee Impact when repeated purchases or transfers create friction.",
          "Use Profit and Loss if you want to compare what later price scenarios do to each path.",
          "Choose the approach that matches whether your problem is entry pacing or capital utilization.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is DCA better than staking for long-term holders?",
        answer:
          "Not automatically. DCA is about how capital enters the market, while staking is about what held capital may earn after entry. The better choice depends on which stage you are actually in.",
      },
      {
        question: "Why is DCA not a true replacement for staking yield?",
        answer:
          "Because DCA manages entry timing, not passive return. Staking and DCA answer different questions and should only be compared once timeline and capital status are clear.",
      },
    ],
  },
];
