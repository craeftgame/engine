import Craeft from "./src/craeft";

declare global {
    namespace NodeJS {
        interface Global {
            craeft: Craeft
        }
    }
}