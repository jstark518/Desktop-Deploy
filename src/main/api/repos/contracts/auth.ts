export interface authConfig {
    github?: authConfigGitHub
    bitbucket?: authConfigBitbucket
}

export interface authConfigGitHub {
    clientId: string
    clientSecret: string
    callback: string
}

export interface authConfigBitbucket {
    clientId: string
    clientSecret: string
    callback: string
}