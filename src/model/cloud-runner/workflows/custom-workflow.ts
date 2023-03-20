import CloudRunnerLogger from '../services/cloud-runner-logger';
import CloudRunnerSecret from '../services/cloud-runner-secret';
import { CloudRunnerFolders } from '../services/cloud-runner-folders';
import CloudRunnerEnvironmentVariable from '../services/cloud-runner-environment-variable';
import { CloudRunnerCustomSteps } from '../services/cloud-runner-custom-steps';
import { CustomStep } from '../services/custom-step';
import CloudRunner from '../cloud-runner';

export class CustomWorkflow {
  public static async runContainerJobFromString(
    buildSteps: string,
    environmentVariables: CloudRunnerEnvironmentVariable[],
    secrets: CloudRunnerSecret[],
  ): Promise<string> {
    return await CustomWorkflow.runContainerJob(
      CloudRunnerCustomSteps.ParseSteps(buildSteps),
      environmentVariables,
      secrets,
    );
  }

  public static async runContainerJob(
    steps: CustomStep[],
    environmentVariables: CloudRunnerEnvironmentVariable[],
    secrets: CloudRunnerSecret[],
  ) {
    try {
      let output = '';

      // if (CloudRunner.buildParameters?.cloudRunnerDebug) {
      //   CloudRunnerLogger.log(`Custom Job Description \n${JSON.stringify(buildSteps, undefined, 4)}`);
      // }
      for (const step of steps) {
        CloudRunnerLogger.log(`Cloud Runner is running in custom job mode`);
        output += await CloudRunner.Provider.runTaskInWorkflow(
          CloudRunner.buildParameters.buildGuid,
          step.image,
          step.commands,
          `/${CloudRunnerFolders.buildVolumeFolder}`,
          `/${CloudRunnerFolders.projectPathAbsolute}/`,
          environmentVariables,
          [...secrets, ...step.secrets],
        );
      }

      return output;
    } catch (error) {
      throw error;
    }
  }
}
