import { IDL as IDL1 } from "./idl_instance_1";
import { IDL as IDL2 } from "./idl_instance_2";

function test(): Uint8Array {
  const blobIDL1 = IDL1.Vec(IDL1.Nat8);

  const encoded = IDL1.encode([blobIDL1], [[1, 2, 3]]);
  const decoded = IDL2.decode([blobIDL1], encoded);

  return decoded[0] as unknown as Uint8Array;
}

const result = test();

console.log(result);
// Should print out something like: Uint8Array(3) [ 1, 2, 3 ]
