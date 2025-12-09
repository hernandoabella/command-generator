"use client";

import { useState } from "react";
import Sidebar from "../components/SideBar";
import { 
  Globe, 
  Search, 
  RefreshCw, 
  Copy,
  Check,
  AlertCircle,
  CheckCircle,
  Server,
  Clock,
  MapPin,
  Shield,
  Mail,
  ChevronDown,
  ChevronUp
} from "lucide-react";

/* ------------------------------
   TypeScript Interfaces
--------------------------------*/
interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

interface WhoisData {
  domain: string;
  registrar: string;
  createdDate: string;
  expiryDate: string;
  updatedDate: string;
  nameservers: string[];
  status: string[];
  registrant?: string;
}

/* ------------------------------
   DNS Record Component
--------------------------------*/
const DNSRecordItem: React.FC<{ record: DNSRecord; onCopy: (text: string) => void }> = ({ record, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(record.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      A: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      AAAA: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
      CNAME: "bg-purple-500/20 text-purple-400 border-purple-500/50",
      MX: "bg-green-500/20 text-green-400 border-green-500/50",
      TXT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      NS: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      SOA: "bg-red-500/20 text-red-400 border-red-500/50",
      PTR: "bg-pink-500/20 text-pink-400 border-pink-500/50",
      SRV: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50"
    };
    return colors[type] || "bg-gray-500/20 text-gray-400 border-gray-500/50";
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-blue-500/50 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(record.type)}`}>
              {record.type}
            </span>
            {record.priority !== undefined && (
              <span className="text-xs text-gray-500">Priority: {record.priority}</span>
            )}
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              TTL: {record.ttl}s
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-mono text-white text-sm break-all">{record.name}</div>
          </div>

          <div className="space-y-1 mt-3">
            <div className="text-sm text-gray-500">Value</div>
            <div className="font-mono text-blue-400 text-sm break-all">{record.value}</div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`p-2 rounded-lg transition-all flex-shrink-0 ${
            copied ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
          title="Copy Value"
        >
          {copied ? <Check size={16} className="text-white" /> : <Copy size={16} className="text-gray-300" />}
        </button>
      </div>
    </div>
  );
};

/* ------------------------------
   Main Component
--------------------------------*/
export default function DNSTools() {
  const [activeTab, setActiveTab] = useState<"lookup" | "whois" | "reverse">("lookup");
  
  // DNS Lookup State
  const [lookupDomain, setLookupDomain] = useState("google.com");
  const [recordType, setRecordType] = useState("ALL");
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // WHOIS State
  const [whoisDomain, setWhoisDomain] = useState("google.com");
  const [whoisData, setWhoisData] = useState<WhoisData | null>(null);
  const [isWhoisLoading, setIsWhoisLoading] = useState(false);

  // Reverse DNS State
  const [reverseIP, setReverseIP] = useState("8.8.8.8");
  const [reverseDomain, setReverseDomain] = useState<string | null>(null);
  const [isReverseLoading, setIsReverseLoading] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    nameservers: true,
    status: true
  });

  /* -------- DNS Lookup Logic -------- */
  const performDNSLookup = () => {
    setIsLookingUp(true);
    setDnsRecords([]);

    setTimeout(() => {
      const mockRecords: DNSRecord[] = [];

      if (recordType === "ALL" || recordType === "A") {
        mockRecords.push({
          type: "A",
          name: lookupDomain,
          value: "142.250.185.46",
          ttl: 300
        });
      }

      if (recordType === "ALL" || recordType === "AAAA") {
        mockRecords.push({
          type: "AAAA",
          name: lookupDomain,
          value: "2607:f8b0:4004:c07::71",
          ttl: 300
        });
      }

      if (recordType === "ALL" || recordType === "CNAME") {
        mockRecords.push({
          type: "CNAME",
          name: `www.${lookupDomain}`,
          value: lookupDomain,
          ttl: 3600
        });
      }

      if (recordType === "ALL" || recordType === "MX") {
        mockRecords.push(
          {
            type: "MX",
            name: lookupDomain,
            value: "smtp.google.com",
            ttl: 3600,
            priority: 10
          },
          {
            type: "MX",
            name: lookupDomain,
            value: "smtp2.google.com",
            ttl: 3600,
            priority: 20
          }
        );
      }

      if (recordType === "ALL" || recordType === "TXT") {
        mockRecords.push({
          type: "TXT",
          name: lookupDomain,
          value: "v=spf1 include:_spf.google.com ~all",
          ttl: 3600
        });
      }

      if (recordType === "ALL" || recordType === "NS") {
        mockRecords.push(
          {
            type: "NS",
            name: lookupDomain,
            value: "ns1.google.com",
            ttl: 21600
          },
          {
            type: "NS",
            name: lookupDomain,
            value: "ns2.google.com",
            ttl: 21600
          }
        );
      }

      setDnsRecords(mockRecords);
      setIsLookingUp(false);
    }, 1000);
  };

  /* -------- WHOIS Logic -------- */
  const performWhoisLookup = () => {
    setIsWhoisLoading(true);
    setWhoisData(null);

    setTimeout(() => {
      const mockWhois: WhoisData = {
        domain: whoisDomain,
        registrar: "MarkMonitor Inc.",
        createdDate: "1997-09-15",
        expiryDate: "2028-09-14",
        updatedDate: "2024-09-09",
        nameservers: [
          "ns1.google.com",
          "ns2.google.com",
          "ns3.google.com",
          "ns4.google.com"
        ],
        status: [
          "clientDeleteProhibited",
          "clientTransferProhibited",
          "clientUpdateProhibited",
          "serverDeleteProhibited",
          "serverTransferProhibited",
          "serverUpdateProhibited"
        ],
        registrant: "Google LLC"
      };

      setWhoisData(mockWhois);
      setIsWhoisLoading(false);
    }, 1500);
  };

  /* -------- Reverse DNS Logic -------- */
  const performReverseLookup = () => {
    setIsReverseLoading(true);
    setReverseDomain(null);

    setTimeout(() => {
      setReverseDomain("dns.google");
      setIsReverseLoading(false);
    }, 1000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
  const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <Sidebar />

      <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-7xl mx-auto pt-20 lg:pt-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 border-b border-gray-700/50 pb-6">
          <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl shadow-lg">
            <Globe className="w-7 h-7 text-white" />
          </div>

          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
              DNS Tools
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Lookup, WHOIS, and Reverse DNS
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className={`${containerBaseClasses} mb-8`}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: "lookup", label: "DNS Lookup", icon: Search },
              { key: "whois", label: "WHOIS", icon: Server },
              { key: "reverse", label: "Reverse DNS", icon: RefreshCw }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === key
                    ? "bg-green-600 text-white ring-2 ring-green-500 shadow"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-700/50 border border-gray-700"
                }`}
              >
                <Icon size={20} />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DNS Lookup Tab */}
        {activeTab === "lookup" && (
          <div className="space-y-6">
            <div className={containerBaseClasses}>
              <h2 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <Search className="text-green-400" size={24} />
                DNS Lookup
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className={labelBaseClasses}>Domain Name</label>
                  <input
                    type="text"
                    value={lookupDomain}
                    onChange={(e) => setLookupDomain(e.target.value)}
                    className={inputBaseClasses}
                    placeholder="example.com"
                    onKeyPress={(e) => e.key === "Enter" && performDNSLookup()}
                  />
                </div>

                <div>
                  <label className={labelBaseClasses}>Record Type</label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className={inputBaseClasses}
                  >
                    <option value="ALL">All Records</option>
                    <option value="A">A (IPv4)</option>
                    <option value="AAAA">AAAA (IPv6)</option>
                    <option value="CNAME">CNAME</option>
                    <option value="MX">MX (Mail)</option>
                    <option value="TXT">TXT</option>
                    <option value="NS">NS (Nameserver)</option>
                    <option value="SOA">SOA</option>
                    <option value="PTR">PTR</option>
                  </select>
                </div>
              </div>

              <button
                onClick={performDNSLookup}
                disabled={isLookingUp}
                className="w-full mt-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                {isLookingUp ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Looking up...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Lookup DNS Records
                  </>
                )}
              </button>
            </div>

            {/* DNS Results */}
            {dnsRecords.length > 0 && (
              <div className={containerBaseClasses}>
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={20} />
                    DNS Records ({dnsRecords.length})
                  </span>
                </h3>

                <div className="space-y-3">
                  {dnsRecords.map((record, idx) => (
                    <DNSRecordItem
                      key={idx}
                      record={record}
                      onCopy={copyToClipboard}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WHOIS Tab */}
        {activeTab === "whois" && (
          <div className="space-y-6">
            <div className={containerBaseClasses}>
              <h2 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <Server className="text-blue-400" size={24} />
                WHOIS Lookup
              </h2>

              <div>
                <label className={labelBaseClasses}>Domain Name</label>
                <input
                  type="text"
                  value={whoisDomain}
                  onChange={(e) => setWhoisDomain(e.target.value)}
                  className={inputBaseClasses}
                  placeholder="example.com"
                  onKeyPress={(e) => e.key === "Enter" && performWhoisLookup()}
                />
              </div>

              <button
                onClick={performWhoisLookup}
                disabled={isWhoisLoading}
                className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                {isWhoisLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Looking up...
                  </>
                ) : (
                  <>
                    <Server size={20} />
                    Lookup WHOIS Information
                  </>
                )}
              </button>
            </div>

            {/* WHOIS Results */}
            {whoisData && (
              <div className={containerBaseClasses}>
                <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center gap-2">
                  <CheckCircle className="text-green-400" size={20} />
                  WHOIS Information
                </h3>

                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Domain</div>
                      <div className="text-white font-semibold">{whoisData.domain}</div>
                    </div>

                    <div className="bg-gray-900 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Registrar</div>
                      <div className="text-white font-semibold">{whoisData.registrar}</div>
                    </div>

                    {whoisData.registrant && (
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Registrant</div>
                        <div className="text-white font-semibold">{whoisData.registrant}</div>
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Clock size={14} />
                        Created Date
                      </div>
                      <div className="text-green-400 font-mono">{whoisData.createdDate}</div>
                    </div>

                    <div className="bg-gray-900 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Clock size={14} />
                        Updated Date
                      </div>
                      <div className="text-blue-400 font-mono">{whoisData.updatedDate}</div>
                    </div>

                    <div className="bg-gray-900 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Clock size={14} />
                        Expiry Date
                      </div>
                      <div className="text-red-400 font-mono">{whoisData.expiryDate}</div>
                    </div>
                  </div>

                  {/* Nameservers */}
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <button
                      onClick={() => toggleSection("nameservers")}
                      className="w-full flex items-center justify-between text-left mb-3"
                    >
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Server size={14} />
                        Nameservers ({whoisData.nameservers.length})
                      </div>
                      {expandedSections.nameservers ? (
                        <ChevronUp size={16} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-500" />
                      )}
                    </button>

                    {expandedSections.nameservers && (
                      <div className="space-y-2">
                        {whoisData.nameservers.map((ns, idx) => (
                          <div key={idx} className="text-blue-400 font-mono text-sm p-2 bg-gray-800 rounded">
                            {ns}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <button
                      onClick={() => toggleSection("status")}
                      className="w-full flex items-center justify-between text-left mb-3"
                    >
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Shield size={14} />
                        Domain Status ({whoisData.status.length})
                      </div>
                      {expandedSections.status ? (
                        <ChevronUp size={16} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-500" />
                      )}
                    </button>

                    {expandedSections.status && (
                      <div className="flex flex-wrap gap-2">
                        {whoisData.status.map((status, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full text-xs font-medium"
                          >
                            {status}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reverse DNS Tab */}
        {activeTab === "reverse" && (
          <div className="space-y-6">
            <div className={containerBaseClasses}>
              <h2 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <RefreshCw className="text-purple-400" size={24} />
                Reverse DNS Lookup
              </h2>

              <div>
                <label className={labelBaseClasses}>IP Address</label>
                <input
                  type="text"
                  value={reverseIP}
                  onChange={(e) => setReverseIP(e.target.value)}
                  className={inputBaseClasses}
                  placeholder="8.8.8.8"
                  onKeyPress={(e) => e.key === "Enter" && performReverseLookup()}
                />
              </div>

              <button
                onClick={performReverseLookup}
                disabled={isReverseLoading}
                className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                {isReverseLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Looking up...
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} />
                    Reverse Lookup
                  </>
                )}
              </button>
            </div>

            {/* Reverse DNS Results */}
            {reverseDomain && (
              <div className={containerBaseClasses}>
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-400" size={20} />
                  Reverse DNS Result
                </h3>

                <div className="bg-gray-900 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">IP Address</div>
                      <div className="font-mono text-blue-400 text-lg">{reverseIP}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-2">Hostname</div>
                      <div className="font-mono text-green-400 text-lg">{reverseDomain}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}