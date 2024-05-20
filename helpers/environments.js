const environments = {};

environments.staging =  {
    port: 3000,
    env_name: 'staging',
    secretKey: 'hdfkllfkjdferkdfkdjf'
}

environments.production =  {
    port: 5000,
    env_name: 'production',
    secretKey: 'ueruieurereiuopdjfkl'
}

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging'

const usedEnvironment = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

export default usedEnvironment;