import { PostEditorForm } from "@/components/admin/post-editor-form";

export default function AdminNewPostPage() {
  return (
    <div>
      <h1 className="mb-8 text-xl font-extrabold uppercase tracking-wide text-ring-gold-bright">
        Νέα δημοσίευση
      </h1>
      <PostEditorForm mode="create" />
    </div>
  );
}
