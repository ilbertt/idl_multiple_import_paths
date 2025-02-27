This repository highlights an issue that Demergent Labs has run into multiple (probably, it's complicated) times in the past couple years while building Azle. Most recently we have explicitly run into this issue in our local testing environment. The conditions under which this occurs can be a bit subtle, but this repository clearly shows the problem:

- If you import `IDL` from `@dfinity/candid` from two different locations, even if they are the exact same version, then `IDL.decode` (maybe `IDL.enode` as well?) breaks entirely.

Here's how to reproduce the errant behavior:

```bash
npm install
cd idl_instance_1
npm install
cd ..
cd idl_instance_2
npm install
cd ..
npm test
```

This error occurs:

```bash

> test
> tsx test.ts

/home/lastmjs/development/test/idl_multiple_import_paths/idl_instance_1/node_modules/@dfinity/candid/src/idl.ts:246
    throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
          ^


Error: type mismatch: type on the wire rec_0, expect type vec nat8
    at VecClass.checkType (/home/lastmjs/development/test/idl_multiple_import_paths/idl_instance_1/node_modules/@dfinity/candid/src/idl.ts:246:11)
    at VecClass.decodeValue (/home/lastmjs/development/test/idl_multiple_import_paths/idl_instance_1/node_modules/@dfinity/candid/src/idl.ts:818:22)
    at <anonymous> (/home/lastmjs/development/test/idl_multiple_import_paths/idl_instance_2/node_modules/@dfinity/candid/src/idl.ts:1827:14)
    at Array.map (<anonymous>)
    at Object.decode (/home/lastmjs/development/test/idl_multiple_import_paths/idl_instance_2/node_modules/@dfinity/candid/src/idl.ts:1826:27)
    at test (/home/lastmjs/development/test/idl_multiple_import_paths/test.ts:8:24)
    at IDL2 (/home/lastmjs/development/test/idl_multiple_import_paths/test.ts:13:16)
    at Object.<anonymous> (/home/lastmjs/development/test/idl_multiple_import_paths/test.ts:15:19)
    at Module._compile (node:internal/modules/cjs/loader:1554:14)
    at Object.transformer (/home/lastmjs/development/test/idl_multiple_import_paths/node_modules/tsx/dist/register-DCnOAxY2.cjs:2:1186)

Node.js v22.14.0
```

I assume there is some kind of internal mutable state that each singleton/instance of `IDL` keeps, thus excluding mixing and matching of `IDL` imports.

This is very unideal behavior, as essentially 1 and only 1 exact version and location of `IDL` can be used in a repository. Azle already includes its own version of `IDL`, exported from `azle`. Our users will not be able to import `IDL` from anywhere else. This problem explicitly arose in a symbolic linking scenario of `azle` with the `IDL` types generated from the `npx azle generate-types` command (which is essentially didc under-the-hood).

We would love to see this issue resolved, not only to resolve our internal workaround, but to exclude future problems from arising.
