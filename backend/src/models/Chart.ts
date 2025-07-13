// src/models/Chart.ts
import mongoose from "mongoose";

export interface IChart extends mongoose.Document {
  title: string;
  prompt: string;
  mermaidCode: string;
  owner: mongoose.Types.ObjectId;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChartSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    mermaidCode: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Chart = mongoose.model<IChart>("Chart", ChartSchema);
