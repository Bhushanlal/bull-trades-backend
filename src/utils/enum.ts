// Define the provider types
export enum Provider {
  EMAIL = "email",
  GOOGLE = "google",
  BOTH = "both",
}

// Define the profile visibility types
export enum ProfileVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

// Define the user status types
export enum UserStatus {
  PENDING = "pending",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum CallOrPut {
  CALL = "call",
  PUT = "put",
}

export enum RiskLevel {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum TradeType {
  OPTION = "option",
  SHARES = "shares",
}

export enum Position {
  BUY = "buy",
  SELL = "sell",
}

export enum UserGender {
  MALE = "male",
  FEMALE = "female",
}

export enum AutoRefColumnName {
  OPTION_FLOW_REFRESH = "optionFlowRefresh",
}

export enum Sentiments {
  BULLISH = "BULLISH",
  BEARISH = "BEARISH",
  NEUTRAL = "NEUTRAL",
}
