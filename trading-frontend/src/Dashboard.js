// src/Dashboard.js
import React from 'react';
import ForexRates from './components/ForexRates'; // 💡 Import from new component file
import BackToTop from './components/BackToTop';
import ChatAssistant from './components/ChatAssistant';


const Dashboard = () => {
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>TradeX</h1>
      <p style={styles.subtitle}>
        Your gateway to secure, smart, and global trading.
      </p>

      {/* Trading Overview Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>📊 Trading Overview</h2>
        <p style={styles.text}>
          <strong>Trading</strong> is the act of buying, selling, or exchanging goods and services between parties. It is fundamental to economic activity, enabling individuals, companies, and countries to access resources, products, or services they need or want.
        </p>

        <h3 style={styles.subheading}>Types of Trading</h3>
        <ul style={styles.list}>
          <li><strong>Domestic Trade:</strong> Trade within the borders of a single country.</li>
          <li><strong>International Trade:</strong> Trade across different countries, involving import and export.</li>
          <li><strong>Wholesale Trade:</strong> Buying and selling goods in large quantities, typically for resale.</li>
          <li><strong>Retail Trade:</strong> Selling goods directly to consumers in smaller quantities.</li>
          <li><strong>Barter Trade:</strong> Exchange of goods and services without using money.</li>
        </ul>

        <h3 style={styles.subheading}>Why Do Countries Trade?</h3>
        <ul style={styles.list}>
          <li>To access goods and services that are not available domestically.</li>
          <li>To benefit from specialization and comparative advantage, producing what they do best.</li>
          <li>To expand markets for their products and increase revenue.</li>
          <li>To obtain resources at lower costs or better quality.</li>
          <li>To foster international cooperation and economic growth.</li>
        </ul>

        <h3 style={styles.subheading}>What is Needed to Perform Trading?</h3>
        <ul style={styles.list}>
          <li><strong>Market Knowledge:</strong> Understanding of demand, supply, and pricing.</li>
          <li><strong>Financial Means:</strong> Capital, credit, or financing options to facilitate purchases.</li>
          <li><strong>Logistics & Infrastructure:</strong> Transportation, warehousing, and communication networks.</li>
          <li><strong>Legal Framework:</strong> Contracts, trade agreements, regulations, and dispute resolution mechanisms.</li>
          <li><strong>Trust & Payment Security:</strong> Reliable payment methods like Letters of Credit or escrow services.</li>
        </ul>
      </section>

      {/* Domestic Trading Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>🏠 Domestic Trading</h2>
        <p style={styles.text}>
          <strong>Domestic Trading</strong> involves the exchange of goods and services within the boundaries of a single country.
          It is governed by local laws, regulations, and market conditions.
        </p>
        <ul style={styles.list}>
          <li><strong>Characteristics:</strong> Typically simpler logistics and fewer regulatory hurdles compared to international trade.</li>
          <li><strong>Payment Methods:</strong> Often cash, credit, or bank transfers without the need for complex financial instruments like LOCs.</li>
          <li><strong>Market Focus:</strong> Targeted at local customers, often with faster delivery times and lower shipping costs.</li>
          <li><strong>Examples:</strong> Retail sales, wholesale distribution, and local service contracts.</li>
        </ul>
      </section>

      {/* International Trading Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>✈️ International Trading</h2>
        <p style={styles.text}>
          <strong>International Trading</strong> is the exchange of goods, services, and capital across national borders.
          It involves more complexity due to customs, tariffs, currency exchange, and international laws.
        </p>
        <ul style={styles.list}>
          <li><strong>Challenges:</strong> Managing currency risk, compliance with import/export regulations, and ensuring timely logistics.</li>
          <li><strong>Financial Instruments:</strong> Letters of Credit, trade finance products, and foreign exchange contracts are commonly used.</li>
          <li><strong>Benefits:</strong> Access to wider markets, potential for higher profits, and diversification of supply sources.</li>
          <li><strong>Examples:</strong> Exporting raw materials, importing machinery, and cross-border e-commerce.</li>
        </ul>
      </section>

      {/* LOC, Finance, Trade Exchange Sections */}
<section style={styles.section}>
  <h2 style={styles.heading}>📜 Letter of Credit (LOC)</h2>
  <p style={styles.text}>
    A <strong>Letter of Credit (LOC)</strong> is a financial document issued by a bank on behalf of a buyer,
    guaranteeing that the seller will receive payment for goods or services provided, provided that the seller meets the terms specified in the LOC.
    It is commonly used in international trade to mitigate risks such as non-payment or shipment issues.
  </p>
  <ul style={styles.list}>
    <li><strong>How it works:</strong> The buyer arranges an LOC with their bank, which promises to pay the seller once the seller presents documents proving shipment or delivery.</li>
    <li><strong>Benefits:</strong> Protects both buyers and sellers, facilitates trust in cross-border transactions, and provides financing flexibility.</li>
  </ul>

  <h3 style={styles.subheading}>📌 Types of Letters of Credit</h3>
  <ul style={styles.list}>
    <li><strong>Revocable LOC:</strong> Can be changed or canceled by the issuing bank without the consent of the seller. Rarely used due to its risk for exporters.</li>
    <li><strong>Irrevocable LOC:</strong> Cannot be altered without agreement from all parties. Provides strong payment assurance for the seller.</li>
    <li><strong>Confirmed LOC:</strong> A second bank (usually in the seller's country) adds its guarantee of payment, in addition to the issuing bank.</li>
    <li><strong>Unconfirmed LOC:</strong> Only the issuing bank is responsible for payment. Riskier for sellers in unstable markets.</li>
    <li><strong>Sight LOC:</strong> Payment is made immediately upon presentation and verification of required documents.</li>
    <li><strong>Usance (Deferred) LOC:</strong> Payment is made after a specified credit period (e.g., 30, 60, 90 days after shipment).</li>
    <li><strong>Transferable LOC:</strong> Allows the beneficiary (seller) to transfer part or all of the credit to another party (like a supplier).</li>
    <li><strong>Back-to-Back LOC:</strong> Two linked LOCs where the buyer uses a master LOC to secure a secondary LOC for another transaction.</li>
    <li><strong>Standby LOC:</strong> Acts more like a guarantee than a traditional LOC—only pays if the buyer defaults.</li>
    <li><strong>Red Clause LOC:</strong> Allows the seller to receive an advance payment before shipping, often used to finance production or procurement.</li>
  </ul>
</section>


<section style={styles.section}>
  <h2 style={styles.heading}>💰 Trade Finance</h2>
  <p style={styles.text}>
    <strong>Trade Finance</strong> refers to the financial products and instruments that companies use to facilitate international trade and commerce.
    It ensures exporters receive timely payment and importers can finance their purchases.
  </p>
  <ul style={styles.list}>
    <li><strong>Purpose:</strong> Reduces risks related to currency fluctuations, political instability, and payment defaults.</li>
    <li><strong>How it helps:</strong> Enables companies to optimize cash flow, secure working capital, and expand into global markets with confidence.</li>
  </ul>

  <h3 style={styles.subheading}>📌 Types of Trade Finance Instruments</h3>
  <ul style={styles.list}>
    <li><strong>Letter of Credit (LOC):</strong> Guarantees payment to the seller upon meeting certain conditions.</li>
    <li><strong>Bank Guarantee:</strong> A promise by a bank to cover losses if a buyer defaults on a trade agreement.</li>
    <li><strong>Export Credit:</strong> Government-backed or private loans to help exporters sell to foreign buyers.</li>
    <li><strong>Factoring:</strong> The exporter sells their accounts receivable (invoices) to a third party (factor) at a discount.</li>
    <li><strong>Forfaiting:</strong> Similar to factoring, but for medium/long-term receivables, often with larger transactions.</li>
    <li><strong>Trade Credit Insurance:</strong> Protects sellers from the risk of non-payment by buyers.</li>
    <li><strong>Supply Chain Finance (Reverse Factoring):</strong> Buyers arrange for early payment to their suppliers through a financial institution.</li>
    <li><strong>Pre-shipment Finance:</strong> Short-term finance provided to exporters before goods are shipped.</li>
    <li><strong>Post-shipment Finance:</strong> Working capital provided to exporters after the shipment has occurred and documents have been submitted.</li>
    <li><strong>Open Account:</strong> Goods are shipped before payment is due. It's high risk for sellers but often used in trusted relationships.</li>
  </ul>
</section>

      <section style={styles.section}>
        <h2 style={styles.heading}>🌐 Trade Exchange</h2>
        <p style={styles.text}>
          A <strong>Trade Exchange</strong> is a platform or network that facilitates the buying and selling of goods and services between businesses and individuals across multiple countries or regions.
          It serves as a marketplace to connect buyers and sellers and streamline global trading.
        </p>
        <ul style={styles.list}>
          <li><strong>Functions:</strong> Matching buyers and sellers globally, providing transparent pricing, handling logistics and payments.</li>
          <li><strong>Benefits:</strong> Enhances market reach, lowers transaction costs, accelerates trade processes, and increases trade volume.</li>
          <li><strong>Examples:</strong> Commodity exchanges, digital trading platforms, and barter networks.</li>
        </ul>
      </section>

      <section style={styles.section}>
  <h2 style={styles.heading}>💱 Live Trade Exchange Rates</h2>
    <ForexRates />
  <div style={styles.rateRow}>
    <div style={styles.rateWidget}>
      <h3>USD → INR</h3>
      
    </div>
    <div style={styles.rateWidget}>
      <h3>EUR → INR</h3>
      
    </div>
  </div>
</section>
<BackToTop />
 <ChatAssistant />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#1e293b',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#64748b',
    marginBottom: '30px',
  },
  section: {
    marginBottom: '35px',
    backgroundColor: '#f1f5f9',
    padding: '20px 25px',
    borderRadius: '10px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '12px',
  },
  subheading: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginTop: '15px',
    marginBottom: '8px',
  },
  text: {
    fontSize: '1rem',
    marginBottom: '15px',
    lineHeight: '1.6',
  },
  list: {
    paddingLeft: '20px',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  rateRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  rateWidget: {
    flex: '1 1 300px',
    textAlign: 'center',
  },
  
};

export default Dashboard;