/**
 * Abstract Class baseRepo
 *
 * @class baseRepo
 */
import {githubRepo} from "./github";

export class baseRepo {
    getRepoList() {
        throw new Error("Method 'getRepoList()' must be implemented.");
    }
}