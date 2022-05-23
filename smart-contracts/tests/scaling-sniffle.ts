import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { ScalingSniffle } from "../target/types/scaling_sniffle";

describe("scaling-sniffle", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ScalingSniffle as Program<ScalingSniffle>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
