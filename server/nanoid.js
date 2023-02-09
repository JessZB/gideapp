import bcryptjs from "bcryptjs";
let password = "1234";
const passwordhashed = await bcryptjs.hash(password, 10);
const passwordhashed2 = await bcryptjs.hash(password, 10);
let encrypted = "$2a$10$vDOAniqWd3Oc.u2Qrl95MusU8oFpqNe/Y6hIOLMbshZvisKDxyI7."
console.log(passwordhashed, passwordhashed2)
setTimeout(async() => {
    
    console.log(await bcryptjs.compare(passwordhashed, passwordhashed2))
}, 1000);



