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

export interface bitBucketCredentials {
    access_token: string
    refresh_token: string
    token_type: string
    scope: string
    expires_in: number
}