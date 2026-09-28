import {
  Bell,
  Heart,
  MessageCircle,
  Sparkles,
  Users,
  Mail,
} from "lucide-react";
import SettingsLayout from "./SettingsLayout";

export default function Notifications() {
  return (
    <SettingsLayout
      activeSection="notifications"
      title="Notifications"
      description="Choose what you want to be notified about."
    >
      <div className="space-y-6">
        <NotificationSection
          title="Artwork Activity"
          description="Stay updated when people interact with your artworks."
          items={[
            {
              icon: MessageCircle,
              title: "Comments on your artworks",
              description: "Get notified when someone comments on your artwork.",
              enabled: true,
            },
            {
              icon: Heart,
              title: "Likes on your artworks",
              description: "Get notified when someone likes your artwork.",
              enabled: true,
            },
            {
              icon: Bell,
              title: "Mentions",
              description: "Get notified when someone mentions you.",
              enabled: true,
            },
          ]}
        />

        <NotificationSection
          title="Social Activity"
          description="Keep up with people and collections you follow."
          items={[
            {
              icon: Users,
              title: "New followers",
              description: "Get notified when someone follows you.",
              enabled: true,
            },
            {
              icon: Bell,
              title: "Collection activity",
              description: "Updates from collections you follow.",
              enabled: false,
            },
          ]}
        />

        <NotificationSection
          title="The ArtWork Stories"
          description="Occasional updates from the community."
          items={[
            {
              icon: Sparkles,
              title: "New features and updates",
              description: "Learn about new features and improvements.",
              enabled: false,
            },
            {
              icon: Mail,
              title: "Community highlights",
              description: "Occasional stories and community highlights.",
              enabled: false,
            },
            {
              icon: Mail,
              title: "Newsletter",
              description: "Receive occasional emails about art and stories.",
              enabled: false,
            },
          ]}
        />
      </div>
    </SettingsLayout>
  );
}

function NotificationSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: {
    icon: React.ElementType;
    title: string;
    description: string;
    enabled: boolean;
  }[];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white/45">
      <div className="border-b border-black/10 px-6 py-5 sm:px-8">
        <h2 className="font-display text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-black/50">{description}</p>
      </div>

      <div className="divide-y divide-black/10">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4 px-6 py-5 sm:px-8"
            >
              <Icon className="size-5 shrink-0 text-black/50" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-black/45">
                  {item.description}
                </p>
              </div>

              <Toggle enabled={item.enabled} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`relative h-6 w-11 shrink-0 rounded-full ${
        enabled ? "bg-[#24231f]" : "bg-black/15"
      }`}
    >
      <span
        className={`absolute top-1 size-4 rounded-full bg-white shadow-sm ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </span>
  );
}