interface Repo {
    name: string
    branches?: Branch[]
    tags?: Tag[]
    commits?: Commit[]
    url?: string
}

interface Branch {
    name: string
    url?: string
    commitHash?: string
}

interface Commit {
    type: CommitType
    hash: string
    date?: Date
    message: string
    url?: string
}

enum CommitType {
    commit = "commit"
}

interface Tag {
    name: string
    date?: Date
    url?: string
    commitHash?: string
}

interface Author {
    displayName: string
    userName: string
    email: string
    url?: string
}

export {Repo, Tag, Branch, CommitType, Commit, Author}
