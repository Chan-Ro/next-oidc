import axios from "axios";
// import ServiceAgent from "service-agent";
import { AppConfigs } from "../../config/AppConfigs";
import { logger } from "../../services/logger";

const USER_SERVICE_URL = AppConfigs?.USER_SERVICE_URI?.startsWith("http")
  ? `${AppConfigs.USER_SERVICE_URI}/`
  : `http://${AppConfigs.USER_SERVICE_URI}/`;

const ax = axios.create({
  baseURL: USER_SERVICE_URL,
  // httpAgent: new ServiceAgent({ service: "" }),
  // httpsAgent: new ServiceAgent({ service: "" }),
});

export default class OrgService {
  static async createOrganisation(
    org: Partial<IOrganisation>
  ): Promise<IOrganisation> {
    return ax
      .post(`/organisation`, { ...org })
      .then((res) => res.data)
      .catch((err) => {
        logger.error("OrgService error", err);
        throw err;
      });
  }

  static async updateOrganisation(
    orgUUID: string,
    data: Partial<IOrganisation>
  ): Promise<IOrganisation> {
    return ax
      .patch(`/organisation/${orgUUID}`, data)
      .then((res) => res.data)
      .catch((err) => {
        logger.error("OrgService error", err);
        throw err;
      });
  }

  static async getOrgByOrgKey(orgKey: string): Promise<IOrganisation> {
    return ax
      .get(`/organisation/orgKey/${orgKey}`)
      .then((res) => res.data)
      .catch((err) => {
        logger.error("OrgService error", err);
        throw err;
      });
  }

  static async getOrgByUUID(orgUUID: string): Promise<IOrganisation> {
    return ax
      .get(`/organisation/${orgUUID}`)
      .then((res) => res.data)
      .catch((err) => {
        logger.error("OrgService error", err);
        throw err;
      });
  }

  static async getPublicOrganisations(): Promise<IOrganisation[]> {
    return ax
      .get("/organisation/public")
      .then((res) => res.data)
      .catch((err) => {
        logger.error("OrgService error", err);
        throw err;
      });
  }

  static async getOrganisations(): Promise<IOrganisation[]> {
    return ax
      .get("/organisation/all")
      .then((res) => res.data)
      .catch((err) => {
        logger.error("OrgService error", err);
        throw err;
      });
  }
}
export interface IOrganisation {
  active: boolean;
  hasAlreadyJoined?: boolean;
  isPrimaryOrg: boolean;
  name: string;
  orgKey: string;
  uuid: string;
  isPublic?: boolean;
  s3BucketName?: string;
}
