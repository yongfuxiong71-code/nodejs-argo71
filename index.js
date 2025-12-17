// ... 前面代码保持不变 ...

// 优化后的文件清理逻辑：只清理临时日志，保留核心运行文件
function cleanFiles() {
  setTimeout(() => {
    // 在容器环境下，不要删除 webPath 和 botPath 等正在运行的二进制文件
    // 否则进程一旦检测到文件消失或重启，会导致容器启动失败
    const filesToDelete = [bootLogPath, configPath]; 
    
    const cmd = process.platform === 'win32' 
      ? `del /f /q ${filesToDelete.join(' ')} > nul 2>&1`
      : `rm -f ${filesToDelete.join(' ')} >/dev/null 2>&1`;

    exec(cmd, (error) => {
      // console.clear(); // 容器日志建议保留，方便排查
      console.log('Temporary config files cleaned. App is running robustly.');
    });
  }, 90000); 
}

// 修改启动逻辑：确保在容器中端口保持监听
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is internal listening on port:${PORT}`);
});

startserver().catch(err => console.error('Critical Start Error:', err));
