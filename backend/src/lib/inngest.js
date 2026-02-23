import inngest, { Inngest } from "inngest";
import coonectDB from "./db.js";
import User from "../models/User.model.js";

export const inngest = new Inngest({ id: "harshal-video-calling-interview-platform" });

const syncUser = inngest.createFunction(
    {id: "sync-user"},
    {event: "clerk/user.created"},
    async ({ event }) => {
        await coonectDB();
        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        const user = new User({
            clerkId: id,
            email: email_addresses[0].email_address,
            firstName: `${first_name || ""} ${last_name || ""}`.trim(),
            imageUrl: image_url
        });

        await user.save();
    }
)

const deleteUserFromDB = inngest.createFunction(
    {id: "delete-user-from-db"},
    {event: "clerk/user.deleted"},
    async ({ event }) => {
        await coonectDB();

        const { id } = event.data;
        await User.findOneAndDelete({ clerkId: id });
    }
)

export const functions = [syncUser, deleteUserFromDB];