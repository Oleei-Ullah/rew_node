const environments = {};

environments.staging =  {
    port: 3000,
    env_name: 'staging',
    secretKey: 'hdfkllfkjdferkdfkdjf',
    maxChecks: 5
}

environments.production =  {
    port: 5000,
    env_name: 'production',
    secretKey: 'ueruieurereiuopdjfkl',
    maxChecks: 5
}

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging'

const usedEnvironment = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

export default usedEnvironment;