import * as React from "react";
import { useNavigate } from "react-router";

const authContext = React.createContext();

export function useAuth() {
    const [authed, setAuthed] = React.useState(false);
    const [authType, setAuthType] = React.useState(null);
   // const navigate = useNavigate();
    return {
        authed,
        authType,
        bitbucketLogin() {
            return new Promise((resolve) => {
                if (typeof window.repo.bbUser !== undefined && window.repo.bbUser !== null) {
                    setAuthType("bitbucket");
                    setAuthed(true);
                }
                resolve(authType);
            });
        },
        githubLogin() {
            return new Promise((resolve) => {
                if (typeof window.repo.ghUser !== undefined && window.repo.ghUser !== null) {
                    setAuthType("github");
                    setAuthed(true);
                }
                resolve(authType);
            });
        },
        logout() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    setAuthed(false);
                    resolve();
                }, 1000);
            });
        }
    };
}

export function AuthProvider({ children }) {
    const auth = useAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function useAuthContext() {
    return React.useContext(authContext);
}