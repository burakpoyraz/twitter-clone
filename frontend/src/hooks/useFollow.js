import { useMutation, useQueryClient } from "@tanstack/react-query";
import { use } from "react";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/user/follow/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries(["suggestedUsers"]),
        queryClient.invalidateQueries(["authUser"]),
      ]);
    },
  });

  return { follow, isPending };
};

export default useFollow;
