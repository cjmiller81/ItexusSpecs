import { IAdminUser } from "features/users/iAdminUser";

export const initAdminUsers: IAdminUser[] = [
  {
    state: 1,
    created_at: "2022-12-14T17:10:17.190799Z",
    credentials: null,
    id: "036a09d8-e4d9-46a1-8889-9b035946efe0",
    metadata_admin: {
      group: "admins"
    },
    metadata_public: {
      IsFifoAdmin: "IsFifoAdmin",
      IsFifoUser: "IsFifoUser",
      role: "admin"
    },
    organization_id: null,
    recovery_addresses: [
      {
        createdAt: "2022-12-14T17:10:17.198895Z",
        id: "f114aecc-0c4f-41f3-8ee8-8ff46c66af21",
        updatedAt: "2022-12-14T17:10:17.198895Z",
        value: "chris@emergentcybernetics.com",
        via: "email",
        additionalProperties: {}
      }
    ],
    schema_id: "5a1e78e990a88d03e1a6936cbe51321a45cdd3b78afa9af8678f7d6bcc9db3aad687f3f715e484d63c89a2a6aaf631f86c75d3dc7af43435dbc2880fe9298e2d",
    schema_url: "https://trading-tools-auth.emergentcybernetics.net/schemas/NWExZTc4ZTk5MGE4OGQwM2UxYTY5MzZjYmU1MTMyMWE0NWNkZDNiNzhhZmE5YWY4Njc4ZjdkNmJjYzlkYjNhYWQ2ODdmM2Y3MTVlNDg0ZDYzYzg5YTJhNmFhZjYzMWY4NmM3NWQzZGM3YWY0MzQzNWRiYzI4ODBmZTkyOThlMmQ",
    state_changed_at: "0001-01-01T00:00:00",
    traits: {
      avatarUrl: "https://vskawrtrgmjkxxmgrpto.supabase.co/storage/v1/object/public/demo-bucket1/public/1184b264-7b3c-4a9a-aba3-d4a8c4e51a30-EC Social Image black.png",
      email: "chris@emergentcybernetics.com",
      name: {
        first: "Chris",
        last: "Miller"
      },
      newsletter: true
    },
    updated_at: "2023-07-18T15:24:05.464997Z",
    verifiable_addresses: [
      {
        via: 1,
        createdAt: "2022-12-14T17:10:17.194262Z",
        id: "bb32f51f-12d8-4588-bf32-2f0aa5914d91",
        status: "completed",
        updatedAt: "2024-05-22T17:03:52.285733Z",
        value: "chris@emergentcybernetics.com",
        verified: true,
        verifiedAt: "2024-05-22T17:03:51.792468Z",
        additionalProperties: {}
      }
    ],
    additional_properties: {},
    roles: []
  },
  {
    state: 1,
    created_at: "2022-12-21T21:24:39.614727Z",
    credentials: null,
    id: "0a95cb7a-3072-44e9-a0ea-62349eadbac7",
    metadata_admin: {
      OryCanAdminUsers: "OryCanAdminUsers",
      group: "admins"
    },
    metadata_public: {
      IsFifoUser: "IsFifoUser",
      role: "admin"
    },
    organization_id: null,
    recovery_addresses: [
      {
        createdAt: "2022-12-21T21:24:39.631493Z",
        id: "64c4e8ff-5cce-4c0d-a936-a112f0f096fb",
        updatedAt: "2022-12-21T21:24:39.631493Z",
        value: "info@emergentcybernetics.com",
        via: "email",
        additionalProperties: {}
      }
    ],
    schema_id: "5a1e78e990a88d03e1a6936cbe51321a45cdd3b78afa9af8678f7d6bcc9db3aad687f3f715e484d63c89a2a6aaf631f86c75d3dc7af43435dbc2880fe9298e2d",
    schema_url: "https://trading-tools-auth.emergentcybernetics.net/schemas/NWExZTc4ZTk5MGE4OGQwM2UxYTY5MzZjYmU1MTMyMWE0NWNkZDNiNzhhZmE5YWY4Njc4ZjdkNmJjYzlkYjNhYWQ2ODdmM2Y3MTVlNDg0ZDYzYzg5YTJhNmFhZjYzMWY4NmM3NWQzZGM3YWY0MzQzNWRiYzI4ODBmZTkyOThlMmQ",
    state_changed_at: "2022-12-21T21:24:39.611458Z",
    traits: {
      avatarUrl: "",
      email: "info@emergentcybernetics.com",
      name: {
        first: "Emergent",
        last: "Cybernetics"
      },
      newsletter: true
    },
    updated_at: "2023-07-26T20:03:48.097417Z",
    verifiable_addresses: [
      {
        via: 1,
        createdAt: "2022-12-21T21:24:39.621879Z",
        id: "6e481041-9bd7-401a-8c74-e9bfa31488e0",
        status: "completed",
        updatedAt: "2022-12-21T21:24:39.621879Z",
        value: "info@emergentcybernetics.com",
        verified: true,
        verifiedAt: "2023-12-15T22:28:53.703171Z",
        additionalProperties: {}
      }
    ],
    additional_properties: {},
    roles: []
  }
];
