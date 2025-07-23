export const seedData = {
  charities: [
    {
      id: 1,
      name: "Hope for Girls",
      email: "hope@example.org",
      mission: "Empowering girls through education and mentorship.",
      status: "approved",
      donors: [
        { name: "Anonymous", email: "anonymous@email.com" },
        { name: "Sophia Carter", email: "sophia.carter@email.com" },
      ],
      beneficiaries: [{ name: "Sophia Adebayo", donor: "Sophia Carter" }],
      oneTimeDonations: [
        {
          donor: "Anonymous",
          email: "anonymous@email.com",
          amount: "$100",
          date: "2025-08-15",
        },
      ],
      recurringDonations: [
        {
          donor: "Sophia Carter",
          email: "sophia.carter@email.com",
          amount: "50",
          startDate: "2025-08-01",
          billingDate: "2025-09-01",
        },
      ],
      inventorySent: [
        {
          item: "1500 pads",
          beneficiary: "Sophia Adebayo",
          donor: "Sophia Carter",
        },
      ],
      stories: [
        {
          title: "Empowering Girls in Rural Malawi",
          description:
            "Providing educational resources and mentorship to girls in rural Malawi.",
          donor: "Sophia Carter",
          beneficiary: "Sophia Adebayo",
          inventory: "School supplies and mentorship materials",
          image: "https://example.com/malawi.jpg",
        },
      ],
    },
    {
      id: 2,
      name: "Future Leaders Initiative",
      email: "leaders@example.org",
      mission: "Providing educational resources and scholarships.",
      status: "pending",
      donors: [],
      beneficiaries: [],
      oneTimeDonations: [],
      recurringDonations: [],
      inventorySent: [],
      stories: [],
    },
    {
      id: 3,
      name: "Girls’ Empowerment Network",
      email: "gen@example.org",
      mission: "Advocating for girls’ rights and access to education.",
      status: "rejected",
      donors: [],
      beneficiaries: [],
      oneTimeDonations: [],
      recurringDonations: [],
      inventorySent: [],
      stories: [],
    },
  ],
  validCredentials: {
    Administrator: {
      email: "admin@example.com",
      password: "admin123",
      name: "Admin",
    },
    Donor: [
      { email: "donor@example.com", password: "password123", name: "Donor" },
      { email: "anonymous@email.com", password: "donor123", name: "Anonymous" },
      {
        email: "sophia.carter@email.com",
        password: "donor123",
        name: "Sophia Carter",
      },
    ],
    Charity: [
      {
        email: "hope@example.org",
        password: "charity123",
        name: "Hope for Girls",
      },
      {
        email: "leaders@example.org",
        password: "charity123",
        name: "Future Leaders Initiative",
      },
      {
        email: "gen@example.org",
        password: "charity123",
        name: "Girls’ Empowerment Network",
      },
    ],
  },
};
