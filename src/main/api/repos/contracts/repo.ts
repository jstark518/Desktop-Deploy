interface Repo {
    /** name of the repo */
    name: string
    /** The repo's branches */
    branches?: Branch[]
    /** The repo's tags */
    tags?: Tag[]
    /** The repo's commits */
    commits?: Commit[]
    /** url of the repo */
    url?: string
    clone?: string
    path?: string
    description?: string
    updated_on?: Date
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

interface repoCache {
    lastModified: any,
    repos?: Repo[]
}

export {Repo, Tag, Branch, CommitType, Commit, Author, repoCache}
