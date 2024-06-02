"use client";
import { listResourcesByUser } from "@/lib/data";
import { ResourceDTO } from "@/lib/types";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ResourceCard from "@/components/resource_card";
export default function Profile() {
  const [resources, setResources] = useState<ResourceDTO[] | null>(null);
  const [error, setError] = useState<string>('');
  const session = useSession();
  useEffect(() => {
    if (session.status === 'authenticated')
      listResourcesByUser(session.data?.user?.id ?? "")
        .then((resources) => setResources(resources))
        .catch((error: Error) => setError(error.message));
  }, [session]);



  return <div>{resources? (resources.map((resource) => (
            <ResourceCard resource={resource} key={resource._id} />
          ))):"Loading..."
          }</div>;
  
}
