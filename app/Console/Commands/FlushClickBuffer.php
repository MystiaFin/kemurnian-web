<?php

namespace App\Console\Commands;

use App\Models\ContactLink;
use App\Models\HourlyClick;
use App\Services\ClickBuffer;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('clicks:flush')]
#[Description('Flush buffered click counts into hourly_clicks')]
class FlushClickBuffer extends Command
{
    public function handle(ClickBuffer $buffer): int
    {
        $data = $buffer->flushAndReset();

        if (empty($data)) {
            $this->info('No clicks to flush.');
            return self::SUCCESS;
        }

        $validIds = ContactLink::whereIn('id', array_keys($data))
            ->pluck('id')
            ->flip();

        $dateHour = now()->startOfHour();

        foreach ($data as $contactLinkId => $count) {
            if (!isset($validIds[$contactLinkId])) {
                continue;
            }

            $existing = HourlyClick::where('contact_link_id', $contactLinkId)
                ->where('date_hour', $dateHour)
                ->first();

            if ($existing) {
                $existing->increment('clicks', $count);
            } else {
                HourlyClick::create([
                    'contact_link_id' => $contactLinkId,
                    'date_hour' => $dateHour,
                    'clicks' => $count,
                ]);
            }
        }

        $this->info('Flushed ' . count($data) . ' link(s).');
        return self::SUCCESS;
    }
}
