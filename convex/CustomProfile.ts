import { ConvexError } from "convex/values";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";

export default Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
    };
  },
  validatePasswordRequirements: (password: string) => {
    if (password.length < 4) {
      throw new ConvexError("INVALID_PASSWORD");
    }
  },
});