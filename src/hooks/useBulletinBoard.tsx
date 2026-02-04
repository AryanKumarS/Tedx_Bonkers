import { useState, useEffect } from "react";

interface Event {
  title: string;
  date: string;
  images: string[];
}

interface BulletinBoardData {
  recentEvents: Event[];
  nextEvent: Event;
}

export const useBulletinBoard = (): BulletinBoardData => {
  const [bulletinData, setBulletinData] = useState<BulletinBoardData>({
    recentEvents: [],
    nextEvent: { title: "", date: "", images: [] },
  });

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For this example, we'll use mock data
    const mockData: BulletinBoardData = {
      recentEvents: [
        {
          title: "TEDx 2023: Synergy",
          date: "June 15, 2023",
          images: [
            "/events/2023-1.jpg",
            "/events/2023-2.jpg",
            "/events/2023-3.jpg",
          ],
        },
        {
          title: "TEDx 2022: Horizons",
          date: "June 20, 2022",
          images: [
            "/events/2022-1.jpg",
            "/events/2022-2.jpg",
            "/events/2022-3.jpg",
          ],
        },
        {
          title: "TEDx 2021: Reimagine",
          date: "June 18, 2021",
          images: [
            "/events/2021-1.jpg",
            "/events/2021-2.jpg",
            "/events/2021-3.jpg",
          ],
        },
      ],
      nextEvent: {
        title: "TEDx 2024: Quantum Leap",
        date: "June 14, 2024",
        images: ["/events/2024-preview-1.jpg", "/events/2024-preview-2.jpg"],
      },
    };

    setBulletinData(mockData);
  }, []);

  return bulletinData;
};
