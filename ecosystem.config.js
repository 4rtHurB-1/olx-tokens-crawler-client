module.exports = {
  apps : [{
      "name": "olx-tokens-crawler",
      "args": [
          "./bin/www"
      ],
      "script": "node",
      "max_memory_restart": "400M",
      "node_args": [],
      "exec_interpreter": "none",
      "exec_mode": "fork",
      "out_file": "/dev/null",
      "error_file": "/dev/null"
  }],
};
