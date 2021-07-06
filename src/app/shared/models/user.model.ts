import { Deserializable } from "./deserializable.model";

export class User implements Deserializable {
    deserialize(input: any) {
      Object.assign(this, input);
      return this;
    }
}