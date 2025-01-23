/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

const chalk = require('chalk');
var os = require('os');

const divider = chalk.gray('\n-----------------------------------');

/**
 * Logger middleware, you can customize it to make messages more personal
 */
const logger = {
  // Called whenever there's an error on the server we want to print
  error: err => {
    console.error(chalk.red(err));
  },

  // Called when express.js app starts on given port w/o errors
  appStarted: (port, host, tunnelStarted) => {
    console.log(`Server started ! ${chalk.green('✓')}`);

    // If the tunnel started, log that and the URL it's available at
    if (tunnelStarted) {
      console.log(`Tunnel initialised ${chalk.green('✓')}`);
    }

    var localAddresses = os.networkInterfaces();
    const ipAddress = Object.keys(localAddresses).reduce((memo, network) => {
      if (memo) return memo;
      const ipv4Internal = localAddresses[network].find(
        entry => entry.family === 'IPv4' && entry.internal,
      );
      return (ipv4Internal && ipv4Internal.address) || memo;
    }, '');

    console.log(`
${chalk.bold('Access URLs:')}${divider}
Localhost: ${chalk.magenta(`http://${host}:${port}`)}
      LAN: ${chalk.magenta(`http://${ipAddress}:${port}`) +
      (tunnelStarted
        ? `\n    Proxy: ${chalk.magenta(tunnelStarted)}`
        : '')}${divider}
${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
  },
};

module.exports = logger;
