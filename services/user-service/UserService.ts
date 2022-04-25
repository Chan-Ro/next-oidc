import axios from "axios";
import { AppConfigs } from "../../config/AppConfigs";
import { logger } from "../../services/logger";
import queryString from "query-string";
import { IOrganisation } from "./OrgService";

const USER_SERVICE_URL = AppConfigs?.USER_SERVICE_URI?.startsWith("http")
  ? `${AppConfigs.USER_SERVICE_URI}/`
  : `http://${AppConfigs.USER_SERVICE_URI}/`;

const ax = axios.create({
  baseURL: USER_SERVICE_URL,
  // httpAgent: new ServiceAgent({ service: '' }),
  // httpsAgent: new ServiceAgent({ service: '' }),
});

export interface ISSOProvider {
  subdomain: string;
  providerName: string;
  orgKey: string;
}

export default class UserService {
  static async ping() {
    logger.info("USER_SERVICE_URI", USER_SERVICE_URL);
    return ax.get(`/ping`);
  }

  static async getUserByUUID(uuid: string) {
    if (!uuid) {
      throw new Error(`User uuid cannot be ${uuid}`);
    }
    return ax
      .get(`/user/${uuid}`)
      .then((res) => {
        if (res.status > 205) {
          logger.error("UserService error", res);
          throw new Error(res.data);
        }
        return res.data;
      })
      .catch((err) => {
        logger.error("UserService error", err);
        throw err;
      });
  }

  static async getOrgFromOrgKey(orgKey: string) {
    if (!orgKey) {
      throw new Error(`orgKey cannot be ${orgKey}`);
    }
    return ax
      .get(`/organisation/orgKey/${orgKey}`)
      .then((res) => {
        if (res.status > 205) {
          logger.error("UserService error", res);
          throw new Error(res.data);
        }
        return res.data;
      })
      .catch((err) => {
        logger.error("UserService error", err);
        throw err;
      });
  }

  static async getOrgUserWithUUID(orgUUID: string, userUUID: string) {
    if (!orgUUID) {
      throw new Error(`orgUUID cannot be ${orgUUID}`);
    }
    if (!userUUID) {
      throw new Error(`userUUID cannot be ${userUUID}`);
    }
    logger.info(`/organisation/${orgUUID}/user/${userUUID}`);
    return ax
      .get(`/organisation/${orgUUID}/user/${userUUID}`)
      .then((res) => {
        if (res.status > 205) {
          logger.error("UserService error", res);
          throw new Error(res.data);
        }
        return res.data;
      })
      .catch((err) => {
        logger.error("UserService error", err);
        throw err;
      });
  }

  static async getOrgUserWithCognitoID(
    orgUUID: string,
    userCognitoID: string
  ): Promise<IUser> {
    if (!orgUUID) {
      throw new Error(`orgUUID cannot be ${orgUUID}`);
    }
    if (!userCognitoID) {
      throw new Error(`userCognitoID cannot be ${userCognitoID}`);
    }
    return ax
      .get(`/organisation/${orgUUID}/user/cognitoID/${userCognitoID}`)
      .then((res) => {
        if (res.status > 205) {
          logger.error("UserService error", res);
          throw new Error(res.data);
        }
        return res.data;
      });
  }

  static async getUserWithCognitoID(userCognitoID: string): Promise<IUser> {
    if (!userCognitoID) {
      throw new Error(`userCognitoID cannot be ${userCognitoID}`);
    }
    return ax.get(`/user/cognitoID/${userCognitoID}`).then((res) => {
      if (res.status > 205) {
        throw new Error(res.data);
      }
      return res.data;
    });
  }

  static async linkCognitoToUser(userCognitoID: string): Promise<IUser> {
    if (!userCognitoID) {
      throw new Error(`userCognitoID cannot be ${userCognitoID}`);
    }
    return ax
      .post(`/user/cognitoID/${userCognitoID}/linkToUser`)
      .then((res) => {
        if (res.status > 205) {
          logger.error("UserService error", res);
          throw new Error(res.data);
        }
        return res.data;
      });
  }

  static async getSSOProvider(data: {
    subdomain?: string;
    provider?: string;
  }): Promise<ISSOProvider> {
    return ax
      .get(`/auth/sso-provider?${queryString.stringify(data)}`)
      .then((res) => {
        if (res.status > 205) {
          logger.error("UserService error", res);
          throw new Error(res.data);
        }
        return res.data;
      });
  }

  static async createUserFromCognitoUser(
    userCognitoID: string
  ): Promise<IUser> {
    if (!userCognitoID) {
      throw new Error(`userCognitoID cannot be ${userCognitoID}`);
    }
    return ax.post(`/user/cognitoID/${userCognitoID}`).then((res) => {
      if (res.status > 205) {
        logger.error("UserService error", res);
        throw new Error(res.data);
      }
      return res.data;
    });
  }

  static async addUserToOrganisation(
    orgUUID: string,
    userUUID: string,
    options?: { isPrimaryOrg?: boolean; active?: boolean }
  ) {
    const opts = {
      ...options,
    };
    if (!orgUUID) {
      throw new Error(`orgUUID cannot be ${orgUUID}`);
    }
    if (!userUUID) {
      throw new Error(`userUUID cannot be ${userUUID}`);
    }
    return ax
      .post(`/organisation/${orgUUID}/user/${userUUID}`, opts)
      .then((res) => {
        if (res.status > 205) {
          logger.error("UserService error", res);
          throw new Error(res.data);
        }
        return res.data;
      });
  }

  static async addGuestUserToOrganisation(
    orgUUID: string,
    user: any,
    overrideUserOrgDBAttributes: any,
    options?: { isPrimaryOrg?: boolean; active?: boolean }
  ) {
    const body = {
      user,
      overrideUserOrgDBAttributes,
    };
    if (!orgUUID) {
      throw new Error(`orgUUID cannot be ${orgUUID}`);
    }
    if (!user) {
      throw new Error(`userUUID cannot be ${user}`);
    }
    const res = await ax.post(`/organisation/${orgUUID}/user/guest`, body);
    if (res.status > 205) {
      logger.error("UserService error addGuestUserToOrganisation", res);
      throw new Error(res.data);
    }
    return res.data;
  }

  static async createUser(user: IUser) {
    return ax.post(`/user/`, user).then((res) => {
      if (res.status > 205) {
        logger.error("UserService error", res);
        throw new Error(res.data);
      }
      return res.data;
    });
  }

  static async getOrgDBCredentials(orgUUID: string) {
    if (!orgUUID) {
      throw new Error(`orgUUID cannot be ${orgUUID}`);
    }
    return ax.get(`/organisation/${orgUUID}/credentials`).then((res) => {
      if (res.status > 205) {
        logger.error("UserService error", res);
        throw new Error(res.data);
      }
      return res.data;
    });
  }

  static async getPrimaryOrgUUIDForUser(userUUID: string) {
    return ax.get(`/user/${userUUID}/primaryOrganisationUUID`).then((res) => {
      if (res.status > 205) {
        logger.error("UserService error", res);
        throw new Error(res.data);
      }
      return res.data;
    });
  }

  static async getOrganisationsForUser(
    userUUID: string
  ): Promise<IOrganisation[]> {
    return ax.get(`/user/${userUUID}/organisations`).then((res) => {
      if (res.status > 205) {
        logger.error("UserService error", res);
        throw new Error(res.data);
      }
      return res.data;
    });
  }

  static async getBulkUsers(userUUIDs: string[]) {
    return ax
      .post(`/user/getBulk`, {
        uuids: userUUIDs,
      })
      .then((res) => {
        if (res.status > 205) {
          logger.error("UserService error", res);
          throw new Error(res.data);
        }
        return res.data;
      });
  }

  static async updateUser(uuid: string, data: any) {
    return ax.put(`/user/${uuid}`, data).then((res) => {
      if (res.status !== 200) {
        throw new Error(res.data);
      }
      return res.data;
    });
  }

  static async getInvitations(
    email: string,
    cognitoID: string
  ): Promise<IInvitation[]> {
    // encoding to base 64 for avoid special character in email
    return ax
      .get(
        "/invitation/check?email=" +
          Buffer.from(email, "utf8").toString("base64") +
          "&cognitoID=" +
          cognitoID
      )
      .then((res) => {
        if (res.status > 205) {
          throw new Error(res.data);
        }
        return res.data;
      });
  }

  static async acceptInvitation(
    uuid: string,
    cognitoID: string
  ): Promise<IInvitation> {
    return ax.put("/invitation/accept/" + uuid, { cognitoID }).then((res) => {
      if (res.status !== 200) {
        throw new Error(res.data);
      }
      return res.data;
    });
  }

  static async rejectInvitation(
    uuid: string,
    cognitoID: string
  ): Promise<IInvitation> {
    return ax.put("/invitation/reject/" + uuid, { cognitoID }).then((res) => {
      if (res.status !== 200) {
        throw new Error(res.data);
      }
      return res.data;
    });
  }

  static async saveQuestionary(data: any) {
    return ax.put(`/questionary`, data).then((res) => {
      if (res.status !== 200) {
        throw new Error(res.data);
      }
      return res.data;
    });
  }
}

export interface IUser {
  uuid: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  cognitoIDs: string[];
  active?: boolean;
  orgUser?: any;
}

export interface IInvitation {
  uuid: string;
  orgUUID: string;
  email: string;
  status: string;
  createdAt: string;
  lastUpdated: string;
  schemaVersion: number;
  active: boolean;
  roles: string[];
  org?: IOrganisation;
}
