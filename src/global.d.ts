import Craeft from "./craeft";

declare global {
    namespace NodeJS {
        interface Global {
            craeft: Craeft
        }
    }
}