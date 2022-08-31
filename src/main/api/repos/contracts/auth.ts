export interface authConfig {
    github?: authConfigGitHub
}

export interface authConfigGitHub {
    clientId: string
    clientSecret: string
    callback: string
}